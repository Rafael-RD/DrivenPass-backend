import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { User } from '@prisma/client';
import { ConflictException, ForbiddenException, NotFoundException } from '../errors';
import Cryptr from 'cryptr'

@Injectable()
export class CredentialsService {
  private cryptr: Cryptr;

  constructor(private readonly credentialsRepository: CredentialsRepository) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_KEY);
  }

  async create(createCredentialDto: CreateCredentialDto, user: User) {
    const existingCredential = await this.credentialsRepository.findCredentialFromUserByTitle(createCredentialDto.title, user.id);
    if (existingCredential !== null) throw new ConflictException('Credential already exists');

    createCredentialDto.password = this.cryptr.encrypt(createCredentialDto.password);
    const createdCredential = await this.credentialsRepository.createCredential(createCredentialDto, user.id);
    return createdCredential;
  }

  async findAllFromUser(user: User) {
    const credentials = await this.credentialsRepository.findCredentialsByUserId(user.id);
    credentials.map(c => delete c.password);
    return credentials;
  }

  async findOneFromUser(id: number, user: User) {
    const credential = await this.credentialsRepository.findCredentialById(id);
    if (credential === null) throw new NotFoundException('Credential not found');
    if (credential.userId !== user.id) throw new ForbiddenException('Credential does not belong to user');

    credential.password = this.cryptr.decrypt(credential.password);
    return credential;
  }

  async update(id: number, updateCredentialDto: UpdateCredentialDto, user: User) {
    const existingCredential = await this.credentialsRepository.findCredentialById(id);
    if (existingCredential === null) throw new NotFoundException('Credential not found');
    if (existingCredential.userId !== user.id) throw new ForbiddenException('Credential does not belong to user');

    if (updateCredentialDto.title !== undefined) {
      const conflictiongCredential = await this.credentialsRepository.findCredentialFromUserByTitle(updateCredentialDto.title, user.id);
      if (conflictiongCredential !== null && conflictiongCredential.id !== id) throw new ConflictException('Credential already exists');
    }

    if (updateCredentialDto.password !== undefined) updateCredentialDto.password = this.cryptr.encrypt(updateCredentialDto.password);
    const updatedCredential = await this.credentialsRepository.updateCredential(id, updateCredentialDto);
    return updatedCredential;
  }

  async remove(id: number, user: User) {
    const existingCredential = await this.credentialsRepository.findCredentialById(id);
    if (existingCredential === null) throw new NotFoundException('Credential not found');
    if (existingCredential.userId !== user.id) throw new ForbiddenException('Credential does not belong to user');

    const deletedCredential = await this.credentialsRepository.deleteCredential(id);
    return deletedCredential;
  }
}

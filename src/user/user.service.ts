import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException, NotFoundException } from '../errors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async findUserById(id: number) {
    const user = await this.userRepository.findUserById(id);
    if (user === null) throw new NotFoundException('User not found');
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (user === null) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(data: CreateUserDto) {
    try {
      const userExists = await this.userRepository.findUserByEmail(data.email);
      if (userExists !== null) throw new ConflictException('User already exists');

      return await this.userRepository.createUser({
        ...data,
        password: bcrypt.hashSync(data.password, 10)
      });
    } catch (error) {
      console.error({ ...error });
    }
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return await this.userRepository.updateUser(id, data);
  }

  async deleteUser(id: number) {
    return await this.userRepository.deleteUser(id);
  }
}

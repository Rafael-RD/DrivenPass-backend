import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCredentialDto } from "./dto/create-credential.dto";
import { UpdateCredentialDto } from "./dto/update-credential.dto";

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findCredentialById(id: number) {
    return await this.prisma.credential.findUnique({
      where: { id },
    });
  }
  async findCredentialsByUserId(userId: number) {
    return await this.prisma.credential.findMany({
      where: { userId },
    });
  }

  async findCredentialFromUserByTitle(title: string, userId: number) {
    return await this.prisma.credential.findUnique({
      where: { userId_title: { userId, title } },
    });
  }

  async createCredential(data: CreateCredentialDto, userId: number) {
    return await this.prisma.credential.create({
      data: { ...data, userId },
    });
  }
  async updateCredential(id: number, data: UpdateCredentialDto) {
    return await this.prisma.credential.update({
      where: { id },
      data,
    });
  }
  async deleteCredential(id: number) {
    return await this.prisma.credential.delete({
      where: { id },
    });
  }
}
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserRepository {
  constructor(private readonly prima: PrismaService) { }

  async findUserById(id: number) {
    return await this.prima.user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prima.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: CreateUserDto) {
    return await this.prima.user.create({
      data,
    });
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return await this.prima.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    return await this.prima.user.delete({
      where: { id },
    });
  }
}
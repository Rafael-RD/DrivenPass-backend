import { faker } from "@faker-js/faker";
import { BaseFactory } from ".";
import { SignupDto } from "../../src/auth/dto/signup.dto";
import * as bcrypt from 'bcrypt';

export class AuthFactory extends BaseFactory {

  static async createInDb() {
    const createUserDto = this.createDto();

    const createdUser = await this.prisma.user.create({
      data: { ...createUserDto, password: bcrypt.hashSync(createUserDto.password, 10) }
    });

    return { createUserDto, createdUser };
  }

  static createDto(): SignupDto {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8, prefix: 'Aa1@' })
    }
  }
}
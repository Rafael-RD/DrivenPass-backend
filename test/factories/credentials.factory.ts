import { faker } from "@faker-js/faker";
import { BaseFactory } from "./factory";
import { CreateCredentialDto } from "../../src/credentials/dto/create-credential.dto";

export class CredentialsFactory extends BaseFactory {

  static async createInDb(userId: number) {
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);

    const createCredentialDto = this.createDto();

    const createdCredential = await this.prisma.credential.create({
      data: { ...createCredentialDto, userId, password: cryptr.encrypt(createCredentialDto.password) }
    });

    return { createCredentialDto, createdCredential };
  }

  static createDto() {
    return {
      title: faker.lorem.word(),
      url: faker.internet.url(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    } as CreateCredentialDto;
  }
}
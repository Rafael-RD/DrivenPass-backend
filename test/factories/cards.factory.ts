import { faker } from "@faker-js/faker";
import { CreateCardDto } from "../../src/cards/dto/create-card.dto";
import { BaseFactory } from "./factory";
import { CardType } from "@prisma/client";

export class CardsFactory extends BaseFactory {

  static async createInDb(userId: number) {
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);

    const createCardDto = this.createDto();

    const createdCard = await this.prisma.card.create({
      data: {
        ...createCardDto,
        userId,
        cvv: cryptr.encrypt(createCardDto.cvv),
        password: cryptr.encrypt(createCardDto.password)
      }
    });

    return { createCardDto, createdCard };
  }

  static createDto() {
    const futureDate = faker.date.future();
    const month = (futureDate.getMonth() + 1).toString();
    const year = futureDate.getFullYear().toString().substring(2);

    return {
      title: faker.lorem.word(),
      number: faker.finance.creditCardNumber(),
      owner: faker.person.fullName(),
      cvv: faker.finance.creditCardCVV(),
      expiration: month.length === 1 ? `0${month}/${year}` : `${month}/${year}`,
      password: faker.number.int({ min: 1000, max: 99999999 }).toString(),
      virtual: faker.datatype.boolean(),
      type: faker.helpers.enumValue(CardType),
    } as CreateCardDto;
  }
}
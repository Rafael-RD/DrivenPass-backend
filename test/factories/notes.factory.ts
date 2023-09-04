import { faker } from "@faker-js/faker";
import { BaseFactory } from ".";
import { CreateNoteDto } from "../../src/notes/dto/create-note.dto";

export class NotesFactory extends BaseFactory {

  static async createInDb(userId: number) {
    const createNoteDto = this.createDto();

    const createdNote = await this.prisma.note.create({
      data: { ...createNoteDto, userId }
    });

    return { createNoteDto, createdNote };
  }

  static createDto() {
    return {
      title: faker.lorem.word(),
      content: faker.lorem.paragraph(),
    } as CreateNoteDto;
  }
}
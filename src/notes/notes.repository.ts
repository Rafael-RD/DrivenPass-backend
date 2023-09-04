import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findNoteById(id: number) {
    return await this.prisma.note.findUnique({
      where: { id },
    });
  }

  async findNotesByUserId(userId: number) {
    return await this.prisma.note.findMany({
      where: { userId },
    });
  }

  async findNoteFromUserByTitle(title: string, userId: number) {
    return await this.prisma.note.findUnique({
      where: { userId_title: { userId, title } },
    });
  }

  async createNote(data: CreateNoteDto, userId: number) {
    return await this.prisma.note.create({
      data: { ...data, userId },
    });
  }

  async updateNote(id: number, data: UpdateNoteDto) {
    return await this.prisma.note.update({
      where: { id },
      data,
    })
  }

  async deleteNote(id: number) {
    return await this.prisma.note.delete({
      where: { id },
    })
  }
}
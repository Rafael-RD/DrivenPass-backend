import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findCardById(id: number) {
    return await this.prisma.card.findUnique({
      where: { id },
    });
  }

  async findCardsByUserId(userId: number) {
    return await this.prisma.card.findMany({
      where: { userId },
    });
  }

  async findCardFromUserByTitle(title: string, userId: number) {
    return await this.prisma.card.findUnique({
      where: { userId_title: { userId, title } },
    });
  }

  async createCard(data: CreateCardDto, userId: number) {
    return await this.prisma.card.create({
      data: { ...data, userId },
    });
  }

  async updateCard(id: number, data: UpdateCardDto) {
    return await this.prisma.card.update({
      where: { id },
      data,
    })
  }

  async deleteCard(id: number) {
    return await this.prisma.card.delete({
      where: { id },
    })
  }
}
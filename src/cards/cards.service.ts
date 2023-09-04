import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardsRepository } from './cards.repository';
import { User } from '@prisma/client';
import { ConflictException, ForbiddenException, NotFoundException } from '../errors';
import Cryptr from 'cryptr';

@Injectable()
export class CardsService {
  private cryptr: Cryptr

  constructor(private readonly notesRepository: CardsRepository) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_KEY);
  }

  async create(createCardDto: CreateCardDto, user: User) {
    const existingCard = await this.notesRepository.findCardFromUserByTitle(createCardDto.title, user.id);
    if (existingCard !== null) throw new ConflictException('Card already exists');

    createCardDto.cvv = this.cryptr.encrypt(createCardDto.cvv);
    createCardDto.password = this.cryptr.encrypt(createCardDto.password);
    const createdCard = await this.notesRepository.createCard(createCardDto, user.id);
    return createdCard;
  }

  async findAllFromUser(user: User) {
    const cards = await this.notesRepository.findCardsByUserId(user.id);
    cards.map(c => {
      delete c.cvv;
      delete c.password;
    });
    return cards;
  }

  async findOneFromUser(id: number, user: User) {
    const card = await this.notesRepository.findCardById(id);
    if (card === null) throw new NotFoundException('Card not found');
    if (card.userId !== user.id) throw new ForbiddenException('Card does not belong to user');

    card.cvv = this.cryptr.decrypt(card.cvv);
    card.password = this.cryptr.decrypt(card.password);
    return card;
  }

  async update(id: number, updateCardDto: UpdateCardDto, user: User) {
    const existingCard = await this.notesRepository.findCardById(id);
    if (existingCard === null) throw new NotFoundException('Card not found');
    if (existingCard.userId !== user.id) throw new ForbiddenException('Card does not belong to user');

    if (updateCardDto.title !== undefined) {
      const conflictiongCard = await this.notesRepository.findCardFromUserByTitle(updateCardDto.title, user.id);
      if (conflictiongCard !== null && conflictiongCard.id !== id) throw new ConflictException('Card already exists');
    }

    if (updateCardDto.cvv !== undefined) updateCardDto.cvv = this.cryptr.encrypt(updateCardDto.cvv);
    if (updateCardDto.password !== undefined) updateCardDto.password = this.cryptr.encrypt(updateCardDto.password);
    const updatedCard = await this.notesRepository.updateCard(id, updateCardDto);
  }

  async remove(id: number, user: User) {
    const existingCard = await this.notesRepository.findCardById(id);
    if (existingCard === null) throw new NotFoundException('Card not found');
    if (existingCard.userId !== user.id) throw new ForbiddenException('Card does not belong to user');

    const deletedCard = await this.notesRepository.deleteCard(id);
    return deletedCard;
  }
}

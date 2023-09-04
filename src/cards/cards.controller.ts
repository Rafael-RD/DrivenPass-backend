import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserLocals } from '../decorators';
import { User } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

  @Post()
  create(@Body() createCardDto: CreateCardDto, @UserLocals() user: User) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  findAll(@UserLocals() user: User) {
    return this.cardsService.findAllFromUser(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserLocals() user: User) {
    return this.cardsService.findOneFromUser(id, user);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCardDto: UpdateCardDto, @UserLocals() user: User) {
    return this.cardsService.update(id, updateCardDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserLocals() user: User) {
    return this.cardsService.remove(id, user);
  }
}

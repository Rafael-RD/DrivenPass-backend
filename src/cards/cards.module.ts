import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CardsRepository } from './cards.repository';

@Module({
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
  imports: [PrismaModule],
})
export class CardsModule { }

import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { CredentialsRepository } from './credentials.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository],
  imports: [PrismaModule],
})
export class CredentialsModule { }

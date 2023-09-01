import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [UserService, UserRepository],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule { }

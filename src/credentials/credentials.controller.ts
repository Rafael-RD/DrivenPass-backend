import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { UserLocals } from '../decorators';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) { }

  @Post()
  create(@Body() createCredentialDto: CreateCredentialDto, @UserLocals() user: User) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  findAllFromUser(@UserLocals() user: User) {
    return this.credentialsService.findAllFromUser(user);
  }

  @Get(':id')
  findOneFromUser(@Param('id', ParseIntPipe) id: number, @UserLocals() user: User) {
    return this.credentialsService.findOneFromUser(id, user);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCredentialDto: UpdateCredentialDto, @UserLocals() user: User) {
    return this.credentialsService.update(id, updateCredentialDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserLocals() user: User) {
    return this.credentialsService.remove(id, user);
  }
}

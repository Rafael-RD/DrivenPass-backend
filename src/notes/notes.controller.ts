import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserLocals } from '../decorators';
import { User } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @UserLocals() user: User) {
    return this.notesService.create(createNoteDto, user);
  }

  @Get()
  findAll(@UserLocals() user: User) {
    return this.notesService.findAllFromUser(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserLocals() user: User) {
    return this.notesService.findOneFromUser(id, user);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNoteDto: UpdateNoteDto, @UserLocals() user: User) {
    return this.notesService.update(id, updateNoteDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserLocals() user: User) {
    return this.notesService.remove(id, user);
  }
}

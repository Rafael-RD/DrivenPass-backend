import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { User } from '@prisma/client';
import { NotesRepository } from './notes.repository';
import { ConflictException } from '../errors/conflict.exception';
import { ForbiddenException, NotFoundException } from '../errors';

@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepository: NotesRepository,
  ) { }

  async create(createNoteDto: CreateNoteDto, user: User) {
    const existingNote = await this.notesRepository.findNoteFromUserByTitle(createNoteDto.title, user.id);
    if (existingNote !== null) throw new ConflictException('Note already exists');

    const createdNote = await this.notesRepository.createNote(createNoteDto, user.id);
    return createdNote;
  }

  async findAllFromUser(user: User) {
    const notes = await this.notesRepository.findNotesByUserId(user.id);
    return notes;
  }

  async findOneFromUser(id: number, user: User) {
    const note = await this.notesRepository.findNoteById(id);
    if (note === null) throw new NotFoundException('Note not found');
    if (note.userId !== user.id) throw new ForbiddenException('Note does not belong to user');

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, user: User) {
    const existingNote = await this.notesRepository.findNoteById(id);
    if (existingNote === null) throw new NotFoundException('Note not found');
    if (existingNote.userId !== user.id) throw new ForbiddenException('Note does not belong to user');

    if (updateNoteDto.title !== undefined) {
      const conflictiongNote = await this.notesRepository.findNoteFromUserByTitle(updateNoteDto.title, user.id);
      if (conflictiongNote !== null && conflictiongNote.id !== id) throw new ConflictException('Note already exists');
    }

    const updatedNote = await this.notesRepository.updateNote(id, updateNoteDto);
    return updatedNote;
  }

  async remove(id: number, user: User) {
    const existingNote = await this.notesRepository.findNoteById(id);
    if (existingNote === null) throw new NotFoundException('Note not found');
    if (existingNote.userId !== user.id) throw new ForbiddenException('Note does not belong to user');

    const deletedNote = await this.notesRepository.deleteNote(id);
    return deletedNote;
  }
}

import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthFactory, NotesFactory } from './factories';

describe('NotesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    await NotesFactory.cleanDb();
  });

  it('/notes (POST)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const note = NotesFactory.createDto();

    const response = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(note)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      title: note.title,
      content: note.content,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userId: createdUser.id
    });
  });

  it('/notes (GET)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createNoteDto, createdNote } = await NotesFactory.createInDb(createdUser.id);

    const response = await request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual([{
      id: createdNote.id,
      title: createNoteDto.title,
      content: createNoteDto.content,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userId: createdUser.id
    }]);
  });

  it('/notes/:id (GET)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createNoteDto, createdNote } = await NotesFactory.createInDb(createdUser.id);

    const response = await request(app.getHttpServer())
      .get(`/notes/${createdNote.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdNote.id,
      title: createNoteDto.title,
      content: createNoteDto.content,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userId: createdUser.id
    });
  });

  it('/notes/:id (PUT)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createNoteDto, createdNote } = await NotesFactory.createInDb(createdUser.id);

    const note = NotesFactory.createDto();

    const response = await request(app.getHttpServer())
      .patch(`/notes/${createdNote.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(note)
      .expect(200);

    expect(response.body).toEqual({
      id: createdNote.id,
      title: note.title,
      content: note.content,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userId: createdUser.id
    });
  });

  it('/notes/:id (DELETE)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createdNote } = await NotesFactory.createInDb(createdUser.id);

    const response = await request(app.getHttpServer())
      .delete(`/notes/${createdNote.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdNote.id,
      title: createdNote.title,
      content: createdNote.content,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userId: createdUser.id
    });
  });
});
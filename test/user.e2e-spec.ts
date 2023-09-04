import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthFactory, CardsFactory, CredentialsFactory, NotesFactory } from './factories';
import { User } from '@prisma/client';

describe('UserController (e2e)', () => {
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

    await AuthFactory.cleanDb();
  });

  it('/user/erase (POST)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();
    const { createCardDto, createdCard } = await CardsFactory.createInDb(createdUser.id);
    const { createCredentialDto, createdCredential } = await CredentialsFactory.createInDb(createdUser.id);
    const { createNoteDto, createdNote } = await NotesFactory.createInDb(createdUser.id);

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const response = await request(app.getHttpServer())
      .post('/user/erase')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: createUserDto.password })
      .expect(200);

    expect(response.body).toEqual({
      ...createdUser,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });

    const users = await prisma.user.findMany();
    const cards = await prisma.card.findMany();
    const credentials = await prisma.credential.findMany();
    const notes = await prisma.note.findMany();

    expect(users).toEqual([]);
    expect(cards).toEqual([]);
    expect(credentials).toEqual([]);
    expect(notes).toEqual([]);
  });

});
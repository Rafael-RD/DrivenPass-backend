import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthFactory, CardsFactory } from './factories';
import { Card } from '@prisma/client';

describe('CardsController (e2e)', () => {
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

    await CardsFactory.cleanDb();
  });

  it('/cards (POST)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const card = CardsFactory.createDto();

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${token}`)
      .send(card)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      title: card.title,
      number: card.number,
      owner: card.owner,
      cvv: expect.any(String),
      expiration: card.expiration,
      password: expect.any(String),
      virtual: card.virtual,
      type: card.type,
      userId: createdUser.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    } as Card);
  });

  it('/cards (GET)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createCardDto, createdCard } = await CardsFactory.createInDb(createdUser.id);

    const response = await request(app.getHttpServer())
      .get('/cards')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual([{
      id: createdCard.id,
      title: createCardDto.title,
      number: createCardDto.number,
      owner: createCardDto.owner,
      expiration: createCardDto.expiration,
      virtual: createCardDto.virtual,
      type: createCardDto.type,
      userId: createdUser.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    }]);
  });

  it('/cards/:id (GET)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createCardDto, createdCard } = await CardsFactory.createInDb(createdUser.id);

    const response = await request(app.getHttpServer())
      .get(`/cards/${createdCard.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdCard.id,
      title: createCardDto.title,
      number: createCardDto.number,
      owner: createCardDto.owner,
      cvv: createCardDto.cvv,
      expiration: createCardDto.expiration,
      password: createCardDto.password,
      virtual: createCardDto.virtual,
      type: createCardDto.type,
      userId: createdUser.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    } as Card);
  });

  it('/cards/:id (PATCH)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createCardDto, createdCard } = await CardsFactory.createInDb(createdUser.id);

    const card = CardsFactory.createDto();

    const response = await request(app.getHttpServer())
      .patch(`/cards/${createdCard.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(card)
      .expect(200);

    expect(response.body).toEqual({
      id: createdCard.id,
      title: card.title,
      number: card.number,
      owner: card.owner,
      cvv: expect.any(String),
      expiration: card.expiration,
      password: expect.any(String),
      virtual: card.virtual,
      type: card.type,
      userId: createdUser.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    } as Card);
  });

  it('/cards/:id (DELETE)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createdCard } = await CardsFactory.createInDb(createdUser.id);

    const response = await request(app.getHttpServer())
      .delete(`/cards/${createdCard.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdCard.id,
      title: createdCard.title,
      number: createdCard.number,
      owner: createdCard.owner,
      cvv: expect.any(String),
      expiration: createdCard.expiration,
      password: expect.any(String),
      virtual: createdCard.virtual,
      type: createdCard.type,
      userId: createdUser.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    } as Card);
  });
});
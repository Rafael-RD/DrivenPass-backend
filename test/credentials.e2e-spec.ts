import * as request from 'supertest';
import { CredentialsModule } from '../src/credentials/credentials.module';
import { AuthFactory, CredentialsFactory } from './factories';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

describe('CredentialsController (e2e)', () => {
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

    await CredentialsFactory.cleanDb();
  });

  it('/credentials (POST)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const credential = CredentialsFactory.createDto();

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('Authorization', `Bearer ${token}`)
      .send(credential)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      title: credential.title,
      url: credential.url,
      username: credential.username,
      password: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userId: createdUser.id
    });
  });

  it('/credentials (GET)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createCredentialDto, createdCredential } = await CredentialsFactory.createInDb(createdUser.id);

    const response = await request(app.getHttpServer())
      .get('/credentials')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual([{
      id: createdCredential.id,
      title: createCredentialDto.title,
      url: createCredentialDto.url,
      username: createCredentialDto.username,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userId: createdUser.id
    }]);
  });

  it('/credentials/:id (GET)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createCredentialDto, createdCredential } = await CredentialsFactory.createInDb(createdUser.id);

    const response = await request(app.getHttpServer())
      .get(`/credentials/${createdCredential.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdCredential.id,
      title: createCredentialDto.title,
      url: createCredentialDto.url,
      username: createCredentialDto.username,
      password: createCredentialDto.password,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userId: createdUser.id
    });
  });

  it('/credentials/:id (PUT)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createCredentialDto, createdCredential } = await CredentialsFactory.createInDb(createdUser.id);

    const credential = CredentialsFactory.createDto();

    const response = await request(app.getHttpServer())
      .patch(`/credentials/${createdCredential.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(credential)
      .expect(200);

    expect(response.body).toEqual({
      id: createdCredential.id,
      title: credential.title,
      url: credential.url,
      username: credential.username,
      password: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userId: createdUser.id
    });
  });

  it('/credentials/:id (DELETE)', async () => {
    const { createUserDto, createdUser } = await AuthFactory.createInDb();

    const token = (await request(app.getHttpServer()).post('/auth/signin').send({ email: createUserDto.email, password: createUserDto.password })).body.accessToken;

    const { createdCredential } = await CredentialsFactory.createInDb(createdUser.id);

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${createdCredential.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdCredential.id,
      title: createdCredential.title,
      url: createdCredential.url,
      username: createdCredential.username,
      password: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userId: createdUser.id
    });
  });

});
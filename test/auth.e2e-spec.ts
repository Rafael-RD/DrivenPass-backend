import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AuthModule } from "../src/auth/auth.module";
import { PrismaService } from "../src/prisma/prisma.service";
import * as request from 'supertest';
import { AuthFactory } from "./factories";
import { User } from "@prisma/client";
import { SigninDto } from "../src/auth/dto/signin.dto";

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    await AuthFactory.cleanDb();
  });

  it('/auth/signup (POST)', async () => {
    const user = AuthFactory.createDto();

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      name: user.name,
      email: user.email,
      password: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    } as User);
  });

  it('/auth/signin (POST)', async () => {
    const { createUserDto: user } = await AuthFactory.createInDb();

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: user.email, password: user.password } as SigninDto)
      .expect(200);

    expect(response.body).toEqual({
      accessToken: expect.any(String)
    });
  });
});
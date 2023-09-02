import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('DrivenPass').addBearerAuth().build()));

  await app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}. Docs: http://localhost:${process.env.PORT}/api`));
}
bootstrap();

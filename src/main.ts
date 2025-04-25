import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<string | number> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port: string | number = process.env.PORT ?? 3000;
  await app.listen(port);
  return port;
}

bootstrap()
  .then((port) => {
    console.log(`App started at port: ${port}`);
  })
  .catch((err) => {
    console.error(err);
  });

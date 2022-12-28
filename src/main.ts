import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://192.168.1.66',
      'http://192.168.1.78:5500',
      'http://192.168.1.78',
    ],
  });
  await app.listen(80);
}
bootstrap();

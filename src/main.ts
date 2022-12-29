import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://192.168.1.66',
      'http://192.168.1.66:5173',
      'http://192.168.1.78:5500',
      'http://192.168.1.78',
      'http://localhost:5173',
    ],
  });
  await app.listen(process.env.PORT || 80);
}
bootstrap();

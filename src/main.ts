import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // <--- esto habilita CORS para todos los orígenes

  app.setGlobalPrefix('api'); // opcional, si usas /api como prefijo
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

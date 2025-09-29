import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable Cross-Origin Resource Sharing to allow the frontend to connect
  app.enableCors(); 
  await app.listen(3001);
  console.log(`Backend is running on: ${await app.getUrl()}`);
}
bootstrap();
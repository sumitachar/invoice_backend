import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // Allow frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all necessary HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allow required headers
    credentials: true, // Allow cookies if needed
  });

  await app.listen(3000);
}
bootstrap();

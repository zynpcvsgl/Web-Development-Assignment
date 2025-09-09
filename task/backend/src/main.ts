import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, { cors: true });

  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,   
      transform: true,  
    }),
  );

  
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();

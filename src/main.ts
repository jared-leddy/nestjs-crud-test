import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1'
  // });
  // app.setGlobalPrefix('api');
  // app.setGlobalPrefix('api/v1', {
  //   exclude: [{ path: '', method: RequestMethod.GET }],
  // });
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  await app.listen(8000);
}
bootstrap();

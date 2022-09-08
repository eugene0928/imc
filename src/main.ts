import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // swagger conf
  const config = new DocumentBuilder()
    .setTitle('IMC platform')
    .setDescription('The IMC API description')
    .setVersion('1.0')
    .addTag('Routes')
    .addBearerAuth()
    .build(); 
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // give limit for files
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  // tell nestjs to know class-validators to validate
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // enable cors reqs
  app.useStaticAssets(join(process.cwd(), "uploads")) 
  app.enableCors();
  await app.listen(3000);
}
bootstrap();

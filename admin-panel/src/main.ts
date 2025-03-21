import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Documentations')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documentFactory);

  app.use(cookieParser());
  // Указываем директорию для статических файлов
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // Указываем директорию для шаблонов
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // Регистрируем паршалы (partials), если они используются
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.registerHelper('eq', (a, b) => a === b);
  // Устанавливаем Handlebars в качестве шаблонизатора
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

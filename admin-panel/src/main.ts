import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  // Указываем директорию для статических файлов
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // Указываем директорию для шаблонов
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // Регистрируем паршалы (partials), если они используются
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  // Устанавливаем Handlebars в качестве шаблонизатора
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  I18nMiddleware,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(I18nMiddleware);
  app.useGlobalPipes(
    new I18nValidationPipe({
      stopAtFirstError: true,
    }),
    // new ValidationPipe({
    //   // stopAtFirstError: true,
    //   // whitelist: true,
    //   // exceptionFactory: (errors) => {
    //   //   const messages = errors[0].constraints;
    //   //   const message = Object.values(messages)[0];
    //   //   const response = { message, statusCode: HttpStatus.BAD_REQUEST };
    //   //   throw new HttpException(response, HttpStatus.BAD_REQUEST);
    //   // },
    // }),
  );
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('BookLend example')
    .setDescription('BookLend description')
    .setVersion('1.0')
    .addTag('books')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5000);
}
bootstrap();

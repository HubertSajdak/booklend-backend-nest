import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { LendBookModule } from './borrowed-book/lend-book.module';
import { GenreModule } from './genre/genre.module';
import { ReaderModule } from './reader/reader.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    AdminModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
        new CookieResolver(['lang', 'locale', 'l']),
      ],
    }),
    BookModule,
    GenreModule,
    ReaderModule,
    LendBookModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '../uploads'),
      serveStaticOptions: { index: false },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

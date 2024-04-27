import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReaderController } from './reader.controller';
import { ReaderService } from './reader.service';
import { ReaderSchema } from './schemas/reader.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LendBookModule } from "../borrowed-book/lend-book.module";
import { LendBookSchema } from "../borrowed-book/schemas/lend-book.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Reader', schema: ReaderSchema },
      { name: 'LendBook', schema: LendBookSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../uploads'),
      serveRoot: '/uploads/',
      serveStaticOptions: { index: false },
    }),
  ],
  providers: [ReaderService],
  controllers: [ReaderController],
})
export class ReaderModule {}

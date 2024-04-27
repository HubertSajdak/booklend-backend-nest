import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookSchema } from 'src/book/schemas/book.schema';
import { ReaderSchema } from 'src/reader/schemas/reader.schema';
import { LendBookController } from './lend-book.controller';
import { LendBookService } from './lend-book.service';
import { LendBookSchema } from './schemas/lend-book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LendBook', schema: LendBookSchema },
      { name: 'Reader', schema: ReaderSchema },
      { name: 'Book', schema: BookSchema },
    ]),
  ],
  providers: [LendBookService],
  controllers: [LendBookController],
  exports: [LendBookService],
})
export class LendBookModule {}

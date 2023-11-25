import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReaderSchema } from 'src/reader/schemas/reader.schema';
import { LendBookController } from './lend-book.controller';
import { LendBookService } from './lend-book.service';
import { LendBookSchema } from './schemas/lend-book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LendBook', schema: LendBookSchema },
      { name: 'Reader', schema: ReaderSchema },
    ]),
  ],
  providers: [LendBookService],
  controllers: [LendBookController],
})
export class LendBookModule {}

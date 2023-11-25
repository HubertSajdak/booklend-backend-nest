import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReaderController } from './reader.controller';
import { ReaderService } from './reader.service';
import { ReaderSchema } from './schemas/reader.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reader', schema: ReaderSchema }]),
  ],
  providers: [ReaderService],
  controllers: [ReaderController],
})
export class ReaderModule {}

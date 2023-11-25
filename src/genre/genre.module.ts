import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { GenreSchema } from './schemas/genre.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Genre', schema: GenreSchema }]),
  ],
  providers: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}

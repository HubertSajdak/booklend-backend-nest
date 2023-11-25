import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateGenreDto {
  _id: mongoose.Types.ObjectId;
  @ApiProperty({
    example: 'sci-fi',
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('book.title.requiredTitle'),
  })
  genreTranslationKey: string;
}

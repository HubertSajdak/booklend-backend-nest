import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import mongoose, { Decimal128 } from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateBookDto {
  _id: mongoose.Types.ObjectId;
  @ApiProperty({
    example: 'The Witcher',
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('book.title.requiredTitle'),
  })
  title: string;
  @ApiProperty({
    example: 'Book description',
    required: true,
  })
  @MinLength(10, {
    message: i18nValidationMessage('book.description.min'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('book.description.requiredDescription'),
  })
  description: string;
  @ApiProperty({
    example: 'Andrzej Sapkowski',
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('book.author.requiredAuthor'),
  })
  author: string;
  @ApiProperty({
    example: 5,
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('book.rating.requiredRating'),
  })
  rating: Decimal128;
  @ApiProperty({
    example: 'sci-fi',
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('book.genre.requiredGenre'),
  })
  genre: string[];
  @ApiProperty({
    example: 378,
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('book.numberOfPages.requiredNumberOfPages'),
  })
  numberOfPages: number;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  photo?: string;
}

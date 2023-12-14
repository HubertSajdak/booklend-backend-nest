import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';
enum LendStatus {
  BORROWED = 'borrowed',
  AVAILABLE = 'available',
}
export class CreateLendBookDto {
  _id: mongoose.Types.ObjectId;
  @ApiProperty({
    name: 'bookId',
    example: 'ABCD123',
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.common.badObject'),
  })
  bookId: mongoose.Types.ObjectId;
  @ApiProperty({
    name: 'readerId',
    example: 'ABCD123',
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.common.badObject'),
  })
  readerId: mongoose.Types.ObjectId;
  @ApiProperty({
    name: 'lendFrom',
    example: '2023-04-15',
    required: true,
  })
  @IsString({
    message: i18nValidationMessage('validation.lendBook.invalidLendBook'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.lendBook.requiredLendBookFrom'),
  })
  lendFrom: string;
  @ApiProperty({
    name: 'lendTo',
    example: '2023-04-15',
    required: true,
  })
  @IsString({
    message: i18nValidationMessage('validation.lendBook.invalidLendBook'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.lendBook.requiredLendBookTo'),
  })
  lendTo: string;
  @ApiProperty({
    name: 'lendStatus',
    example: 'borrowed | available',
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.lendBook.requiredLendBookTo'),
  })
  @IsEnum(LendStatus)
  lendStatus: LendStatus;
}

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';
enum LendStatus {
  BORROWED = 'borrowed',
  AVAILABLE = 'available',
}
export class CreateLendBookDto {
  _id: mongoose.Types.ObjectId;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.common.badObject'),
  })
  bookId: mongoose.Types.ObjectId;
  @IsNotEmpty({
    message: i18nValidationMessage('validation.common.badObject'),
  })
  readerId: mongoose.Types.ObjectId;
  @IsString({
    message: i18nValidationMessage('validation.lendBook.invalidLendBook'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.lendBook.requiredLendBookFrom'),
  })
  lendFrom: string;
  @IsString({
    message: i18nValidationMessage('validation.lendBook.invalidLendBook'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.lendBook.requiredLendBookTo'),
  })
  lendTo: string;
  @IsNotEmpty({
    message: i18nValidationMessage('validation.lendBook.requiredLendBookTo'),
  })
  @IsEnum(LendStatus)
  lendStatus: LendStatus;
}

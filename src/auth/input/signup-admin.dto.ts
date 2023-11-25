import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';
import { regexType } from 'src/utils/regex';

export class SignUpAdminDto {
  _id: mongoose.Types.ObjectId;
  @ApiProperty({
    example: 'John',
    required: true,
  })
  @Matches(regexType.name, {
    message: i18nValidationMessage('validation.firstName.invalidFirstName'),
  })
  @MinLength(2, {
    message: i18nValidationMessage('validation.firstName.invalidFirstName'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.firstName.requiredFirstName'),
  })
  firstName: string;
  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @Matches(regexType.name, {
    message: i18nValidationMessage('validation.lastName.invalidLastName'),
  })
  @MinLength(2, {
    message: i18nValidationMessage('validation.lastName.invalidLastName'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.lastName.requiredLastName'),
  })
  lastName: string;
  @ApiProperty({
    example: 'test@test.com',
    required: true,
  })
  @IsEmail(
    {},
    { message: i18nValidationMessage('validation.email.invalidEmail') },
  )
  @IsNotEmpty({
    message: i18nValidationMessage('validation.email.requiredEmail'),
  })
  email: string;
  @ApiProperty({
    example: 'Abcdef@2',
    required: true,
  })
  @Matches(regexType.password, {
    message: i18nValidationMessage('validation.password.invalidPassword'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.password.requiredPassword'),
  })
  password: string;
  // @IsString({ message: i18nValidationMessage('validation.badFormat') })
  @IsOptional()
  photo?: string;
}

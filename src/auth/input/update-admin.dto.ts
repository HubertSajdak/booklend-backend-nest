import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { regexType } from 'src/utils/regex';

export class UpdateAdminDto {
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
    required: false,
  })
  @IsString({})
  @IsOptional({})
  photo?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';
import { regexType } from 'src/utils/regex';
class AddressDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.address.requiredStreet'),
  })
  street: string;
  @IsNotEmpty({
    message: i18nValidationMessage('validation.address.requiredCity'),
  })
  city: string;
  @IsNotEmpty({
    message: i18nValidationMessage('validation.address.requiredPostalCode'),
  })
  @MinLength(6, {
    message: i18nValidationMessage('validation.address.invalidPostalCode'),
  })
  @MaxLength(6, {
    message: i18nValidationMessage('validation.address.invalidPostalCode'),
  })
  postalCode: string;
}
export class CreateReaderDto {
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
    example: '123456789',
    required: true,
  })
  @MaxLength(9, {
    message: i18nValidationMessage('validation.phoneNumber.invalidNumber'),
  })
  @MinLength(9, {
    message: i18nValidationMessage('validation.phoneNumber.invalidNumber'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage(
      'validation.phoneNumber.requiredPhoneNumber',
    ),
  })
  phoneNumber: string;
  @ApiProperty({
    example: {
      street: 'Szczęśliwicka 1',
      city: 'Warsaw',
      postalCode: '00-001',
    },
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: AddressDto;
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'uploads/doctor1.jpg',
    required: false,
  })
  photo?: string;
}

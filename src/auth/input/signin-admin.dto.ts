import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignInAdminDto {
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
  readonly email: string;
  @ApiProperty({
    example: 'Abcdef@2',
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.password.requiredPassword'),
  })
  readonly password: string;
}

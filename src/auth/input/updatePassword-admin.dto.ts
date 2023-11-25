import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { regexType } from 'src/utils/regex';

export class UpdateAdminPasswordDto {
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
  @ApiProperty({
    example: 'Abcdef@2',
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.password.requiredPassword'),
  })
  confirmPassword: string;
}

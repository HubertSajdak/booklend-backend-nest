import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuardJwt } from './auth-guard.jwt';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './input/refresh-token.dto';
import { SignInAdminDto } from './input/signin-admin.dto';
import { SignUpAdminDto } from './input/signup-admin.dto';
import { UpdateAdminDto } from './input/update-admin.dto';
import { UpdateAdminPasswordDto } from './input/updatePassword-admin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiResponse({ status: 200, description: 'Admin created' })
  @ApiResponse({ status: 400, description: 'Bad object structure' })
  @ApiResponse({ status: 400, description: 'Admin already exists' })
  @Post('register')
  signUp(
    @I18n() i18n: I18nContext,
    @Body() signUpAdminDto: SignUpAdminDto,
  ): Promise<{ message: string }> {
    return this.authService.signUp(i18n, signUpAdminDto);
  }
  @ApiResponse({ status: 200, description: 'Welcome {user}' })
  @ApiResponse({ status: 404, description: 'Email not found' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @Post('login')
  signIn(
    @I18n() i18n: I18nContext,
    @Body() signInAdminDto: SignInAdminDto,
  ): Promise<{ message: string; accessToken: string; refreshToken: string }> {
    return this.authService.signIn(i18n, signInAdminDto);
  }
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Admin info updated' })
  @ApiResponse({ status: 400, description: 'Bad object structure' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuardJwt)
  @Put('me')
  updateAdminInfo(
    @Req() req: any,
    @I18n() i18n: I18nContext,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<{ message: string }> {
    return this.authService.updateAdminInfo(req, i18n, updateAdminDto);
  }
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Admin info', type: UpdateAdminDto })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuardJwt)
  @Get('me')
  getAdminData(
    @Req() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ firstName: string; lastName: string; email: string }> {
    return this.authService.getAdminData(req, i18n);
  }
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Password updated' })
  @ApiResponse({ status: 400, description: 'Invalid confirm password' })
  @UseGuards(AuthGuardJwt)
  @Put('me/updatePassword')
  updateAdminPassword(
    @Req() req: any,
    @I18n() i18n: I18nContext,
    @Body() updateAdminPassword: UpdateAdminPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.updateAdminPassword(req, i18n, updateAdminPassword);
  }

  @ApiResponse({
    status: 200,
    description: 'New Access Token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Object Structure',
  })
  @ApiResponse({
    status: 401,
    description: 'Session expired',
  })
  @Post('refreshToken')
  refreshToken(
    @I18n() i18n: I18nContext,
    @Body()
    input: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(i18n, input);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad object structure',
  })
  @ApiResponse({
    status: 401,
    description: 'Session expired',
  })
  @UseGuards(AuthGuardJwt)
  @Post('me/uploadPhoto')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Content-Type : multipart/form-data',
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Object Structure',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  uploadAdminPhoto(
    @I18n() i18n: I18nContext,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1048576,
            message: 'validation.file.tooLarge',
          }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.authService.uploadAdminPhoto(i18n, file, req);
  }
}

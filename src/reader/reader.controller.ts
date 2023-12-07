import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CreateReaderDto } from './input/create-reader.dto';
import { ReaderService } from './reader.service';
import { Reader } from './schemas/reader.schema';

@Controller('readers')
export class ReaderController {
  constructor(private readerService: ReaderService) {}
  @UseGuards(AuthGuardJwt)
  @Post()
  createReader(
    @Req() req: any,
    @I18n() i18n: I18nContext,
    @Body(new ValidationPipe()) input: CreateReaderDto,
  ): Promise<{ message: string }> {
    return this.readerService.createReader(req, i18n, input);
  }
  @UseGuards(AuthGuardJwt)
  @Get()
  getAllReaders(
    @Query() query: any,
    @Req() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: Reader[]; totalItems: number; numOfPages: number }> {
    return this.readerService.getAllReaders(query, req, i18n);
  }
  @UseGuards(AuthGuardJwt)
  @Get(':id')
  getSingleReader(
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<Reader> {
    return this.readerService.getSingleReader(params, i18n);
  }
  @UseGuards(AuthGuardJwt)
  @Put(':id')
  updateReader(
    @Param() params: any,
    @I18n() i18n: I18nContext,
    input: CreateReaderDto,
  ): Promise<{ message: string }> {
    return this.readerService.updateReader(params, i18n, input);
  }
  @UseGuards(AuthGuardJwt)
  @Delete(':id')
  deleteReader(
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ message: string }> {
    return this.readerService.deleteReader(params, i18n);
  }
  @UseGuards(AuthGuardJwt)
  @Post('uploadPhoto/:id')
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
  uploadReaderPhoto(
    @I18n() i18n: I18nContext,
    @Param() params: any,
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
  ) {
    return this.readerService.uploadReaderPhoto(i18n, params, file);
  }
}

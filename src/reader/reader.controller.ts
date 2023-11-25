import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CreateReaderDto } from './input/create-reader.dto';
import { ReaderService } from './reader.service';
import { Reader } from './schemas/reader.schema';

@Controller('reader')
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
  getAllReaders(@Req() req: any, @I18n() i18n: I18nContext): Promise<Reader[]> {
    return this.readerService.getAllReaders(req, i18n);
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
}

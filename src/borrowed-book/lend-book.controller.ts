import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CreateLendBookDto } from './input/create-lend-book.dto';
import { LendBookService } from './lend-book.service';
import { LendBook } from './schemas/lend-book.schema';

@Controller('lend-book')
export class LendBookController {
  constructor(private lendBookService: LendBookService) {}
  @UseGuards(AuthGuardJwt)
  @Post()
  createLendedBook(
    @Req() req: any,
    @I18n() i18n: I18nContext,
    @Body() input: CreateLendBookDto,
  ): Promise<{ message: string }> {
    return this.lendBookService.createLendedBook(req, i18n, input);
  }
  @UseGuards(AuthGuardJwt)
  @Put(':id')
  updateLendedBook(
    @Param() params: any,
    @I18n() i18n: I18nContext,
    @Body() input: CreateLendBookDto,
  ): Promise<{ message: string }> {
    return this.lendBookService.updateLendedBook(params, i18n, input);
  }
  @UseGuards(AuthGuardJwt)
  @Get()
  getAllLendedBooks(
    @Query() query: any,
    @Req() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: LendBook[]; totalItems: number; numOfPages: number }> {
    return this.lendBookService.getAllLendedBooks(query, req, i18n);
  }
  @UseGuards(AuthGuardJwt)
  @Get('reader/:id')
  getReaderLendedBooks(
    @Query() query: any,
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: LendBook[]; totalItems: number; numOfPages: number }> {
    return this.lendBookService.getReaderLendedBooks(query, params, i18n);
  }
  @UseGuards(AuthGuardJwt)
  @Get(':id')
  getSingleLendedBook(
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<LendBook> {
    return this.lendBookService.getSingleLendedBook(params, i18n);
  }
}

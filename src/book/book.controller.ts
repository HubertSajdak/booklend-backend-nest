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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { BookService } from './book.service';
import { CreateBookDto } from './input/create-book.dto';
import { UpdateBookDto } from './input/update-book.dto';
import { Book } from './schemas/book.schema';
@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}
  @UseGuards(AuthGuardJwt)
  @Post()
  createBook(
    @Req() req: any,
    @I18n() i18n: I18nContext,
    @Body() input: CreateBookDto,
  ): Promise<{ message: string }> {
    return this.bookService.createBook(req, i18n, input);
  }

  @UseGuards(AuthGuardJwt)
  @Get(':id')
  getSingleBook(
    @I18n() i18n: I18nContext,
    @Param() params: any,
  ): Promise<Book> {
    return this.bookService.getSingleBook(i18n, params);
  }
  @UseGuards(AuthGuardJwt)
  @Get()
  getAllBooks(@Req() req: any, @I18n() i18n: I18nContext): Promise<Book[]> {
    return this.bookService.getAllBooks(req, i18n);
  }
  @UseGuards(AuthGuardJwt)
  @Put(':id')
  updateBook(
    @I18n() i18n: I18nContext,
    @Param() params: any,
    @Body() input: UpdateBookDto,
  ): Promise<{ message: string }> {
    return this.bookService.updateBook(i18n, params, input);
  }
  @UseGuards(AuthGuardJwt)
  @Delete(':id')
  deleteBook(
    @I18n() i18n: I18nContext,
    @Param() params: any,
  ): Promise<{ message: string }> {
    return this.bookService.deleteBook(i18n, params);
  }
}

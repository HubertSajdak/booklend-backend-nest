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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
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
  getAllBooks(
    @Query() query: any,
    @Req() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: Book[]; totalItems: number; numOfPages: number }> {
    return this.bookService.getAllBooks(query, req, i18n);
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
  uploadBookPhoto(
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
    return this.bookService.uploadBookPhoto(i18n, params, file);
  }
}

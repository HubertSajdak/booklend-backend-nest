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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { JwtStrategy } from 'src/auth/jwt-strategy';
import { SuccessResponse } from 'src/types/swagger-types';
import { BookService } from './book.service';
import { CreateBookDto } from './input/create-book.dto';
import { UpdateBookDto } from './input/update-book.dto';
import { Book } from './schemas/book.schema';
@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Book created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad object structure',
  })
  @UseGuards(AuthGuardJwt)
  @Post()
  createBook(
    @Req() req: any,
    @I18n() i18n: I18nContext,
    @Body() input: CreateBookDto,
  ): Promise<{ message: string }> {
    return this.bookService.createBook(req, i18n, input);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'book id',
  })
  @ApiResponse({
    status: 200,
    description: 'Book data',
    type: CreateBookDto,
  })
  @UseGuards(AuthGuardJwt)
  @Get(':id')
  getSingleBook(
    @I18n() i18n: I18nContext,
    @Param() params: any,
  ): Promise<Book> {
    return this.bookService.getSingleBook(i18n, params);
  }
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Array of book data',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Books not found',
  })
  @ApiQuery({
    name: 'search',
    example: 'Wiedźmin',
  })
  @ApiQuery({
    name: 'sortBy',
    example: 'firstName',
  })
  @ApiQuery({
    name: 'sortDirection',
    example: 'asc | desc',
  })
  @ApiQuery({
    name: 'pageSize',
    example: 1,
  })
  @ApiQuery({
    name: 'currentPage',
    example: 1,
  })
  @UseGuards(AuthGuardJwt)
  @Get()
  getAllBooks(
    @Query() query: any,
    @Req() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: Book[]; totalItems: number; numOfPages: number }> {
    return this.bookService.getAllBooks(query, req, i18n);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'book id',
  })
  @ApiResponse({
    status: 201,
    description: 'Book updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad object structure',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @UseGuards(AuthGuardJwt)
  @Put(':id')
  updateBook(
    @I18n() i18n: I18nContext,
    @Param() params: any,
    @Body() input: UpdateBookDto,
  ): Promise<{ message: string }> {
    return this.bookService.updateBook(i18n, params, input);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'book id',
  })
  @ApiResponse({
    status: 200,
    description: 'Book deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
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
  @ApiBearerAuth()
  @ApiParam({
    name: 'book id',
  })
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
    description: 'Book not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
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
  @UseGuards(JwtStrategy)
  @Delete('deletePhoto/:id')
  deleteBookPhoto(@I18n() i18n: I18nContext, @Param() params: any) {
    return this.bookService.deleteBookPhoto(i18n, params);
  }
}

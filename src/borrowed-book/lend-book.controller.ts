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
import {
  ApiBearerAuth,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { SuccessResponse } from 'src/types/swagger-types';
import { CreateLendBookDto } from './input/create-lend-book.dto';
import { LendBookService } from './lend-book.service';
import { LendBook } from './schemas/lend-book.schema';
@ApiTags('Lend Book')
@Controller('lend-book')
export class LendBookController {
  constructor(private lendBookService: LendBookService) {}
  @ApiBearerAuth()
  @ApiProperty({
    type: CreateLendBookDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Book lended',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad object structure',
  })
  @ApiResponse({
    status: 400,
    description: 'Book already lended',
  })
  @ApiResponse({
    status: 404,
    description: 'Reader not found',
  })
  @UseGuards(AuthGuardJwt)
  @Post()
  createLendedBook(
    @Req() req: any,
    @I18n() i18n: I18nContext,
    @Body() input: CreateLendBookDto,
  ): Promise<{ message: string }> {
    return this.lendBookService.createLendedBook(req, i18n, input);
  }
  @ApiBearerAuth()
  @ApiProperty({
    type: CreateLendBookDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Book lend updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad object structure',
  })
  @ApiResponse({
    status: 404,
    description: 'Reader not found',
  })
  @ApiResponse({
    status: 404,
    description: 'No lended books with this ID',
  })
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
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Array of lended books',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad object structure',
  })
  @ApiResponse({
    status: 404,
    description: 'No lended books found',
  })
  @ApiQuery({
    name: 'sortBy',
    example: 'lendStatus',
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
  getAllLendedBooks(
    @Query() query: any,
    @Req() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: LendBook[]; totalItems: number; numOfPages: number }> {
    return this.lendBookService.getAllLendedBooks(query, req, i18n);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'reader id',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of lended books',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No lended books found',
  })
  @ApiQuery({
    name: 'sortBy',
    example: 'lendStatus',
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
  @Get('reader/:id')
  getReaderLendedBooks(
    @Query() query: any,
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: LendBook[]; totalItems: number; numOfPages: number }> {
    return this.lendBookService.getReaderLendedBooks(query, params, i18n);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'reader id',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of lended books',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No lended books found',
  })
  @ApiQuery({
    name: 'sortBy',
    example: 'lendStatus',
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
  @Get('book/:id')
  getBookLendHistory(
    @Query() query: any,
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: LendBook[]; totalItems: number; numOfPages: number }> {
    return this.lendBookService.getBookLendHistory(query, params, i18n);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'lended book id',
  })
  @ApiResponse({
    status: 200,
    description: 'Lended book',
    type: CreateLendBookDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No lended book found',
  })
  @UseGuards(AuthGuardJwt)
  @Get(':id')
  getSingleLendedBook(
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<LendBook> {
    return this.lendBookService.getSingleLendedBook(params, i18n);
  }
}

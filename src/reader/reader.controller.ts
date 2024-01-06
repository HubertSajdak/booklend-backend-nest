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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { SuccessResponse } from 'src/types/swagger-types';
import { CreateReaderDto } from './input/create-reader.dto';
import { ReaderService } from './reader.service';
import { Reader } from './schemas/reader.schema';
@ApiTags('Readers')
@Controller('readers')
export class ReaderController {
  constructor(private readerService: ReaderService) {}
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Reader created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad object structure',
  })
  @ApiProperty({
    type: CreateReaderDto,
  })
  @UseGuards(AuthGuardJwt)
  @Post()
  createReader(
    @Req() req: any,
    @I18n() i18n: I18nContext,
    @Body(new ValidationPipe()) input: CreateReaderDto,
  ): Promise<{ message: string }> {
    return this.readerService.createReader(req, i18n, input);
  }
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No reader found',
  })
  @ApiQuery({
    name: 'search',
    example: 'john',
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
  getAllReaders(
    @Query() query: any,
    @Req() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: Reader[]; totalItems: number; numOfPages: number }> {
    return this.readerService.getAllReaders(query, req, i18n);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'reader id',
  })
  @ApiResponse({
    status: 200,
    description: 'Reader data',
    type: CreateReaderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Reader not found',
  })
  @UseGuards(AuthGuardJwt)
  @Get(':id')
  getSingleReader(
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<Reader> {
    return this.readerService.getSingleReader(params, i18n);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'reader id',
  })
  @ApiProperty({
    type: CreateReaderDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Reader info updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 404,
    description: 'Reader Not found',
  })
  @UseGuards(AuthGuardJwt)
  @Put(':id')
  updateReader(
    @Param() params: any,
    @I18n() i18n: I18nContext,
    input: CreateReaderDto,
  ): Promise<{ message: string }> {
    return this.readerService.updateReader(params, i18n, input);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'reader id',
  })
  @ApiResponse({
    status: 200,
    description: 'Reader deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Reader not found',
  })
  @UseGuards(AuthGuardJwt)
  @Delete(':id')
  deleteReader(
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<{ message: string }> {
    return this.readerService.deleteReader(params, i18n);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'reader id',
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
  @UseGuards(AuthGuardJwt)
  @Delete('deletePhoto/:id')
  deleteReaderPhoto(@I18n() i18n: I18nContext, @Param() params: any) {
    return this.readerService.deleteReaderPhoto(i18n, params);
  }
}

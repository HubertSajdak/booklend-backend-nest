import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './input/create-genre.dto';
import { Genre } from './schemas/genre.schema';
@ApiTags('Genres')
@Controller('genres')
export class GenreController {
  constructor(private genreService: GenreService) {}
  @ApiBearerAuth()
  @ApiProperty({
    type: CreateGenreDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Genre created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad object structure',
  })
  @ApiResponse({
    status: 400,
    description: 'Genre already exists',
  })
  @UseGuards(AuthGuardJwt)
  @Post()
  createGenre(
    @I18n() i18n: I18nContext,
    @Body() input: CreateGenreDto,
  ): Promise<{ message: string }> {
    return this.genreService.createGenre(i18n, input);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'Genre Id',
  })
  @ApiProperty({
    type: CreateGenreDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Genre created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad object structure',
  })
  @ApiResponse({
    status: 400,
    description: 'Genre already exists',
  })
  @UseGuards(AuthGuardJwt)
  @Put(':id')
  updateGenre(
    @I18n() i18n: I18nContext,
    @Param() params: any,
    @Body() input: CreateGenreDto,
  ): Promise<{ message: string }> {
    return this.genreService.updateGenre(params, i18n, input);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'Genre Id',
  })
  @ApiResponse({
    status: 201,
    description: 'Genre removed',
  })
  @ApiResponse({
    status: 404,
    description: 'Genre not found',
  })
  @UseGuards(AuthGuardJwt)
  @Delete(':id')
  deleteGenre(
    @I18n() i18n: I18nContext,
    @Param() params: any,
  ): Promise<{ message: string }> {
    return this.genreService.deleteGenre(params, i18n);
  }
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: [CreateGenreDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Genres not found',
  })
  @UseGuards(AuthGuardJwt)
  @Get()
  getAllGenres(@I18n() i18n: I18nContext): Promise<Genre[]> {
    return this.genreService.getAllGenres(i18n);
  }
  @ApiBearerAuth()
  @ApiParam({
    name: 'Genre Id',
  })
  @ApiResponse({
    status: 200,
    type: CreateGenreDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Genre not found',
  })
  @UseGuards(AuthGuardJwt)
  @Get(':id')
  getSingleGenre(
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<Genre> {
    return this.genreService.getSingleGenre(params, i18n);
  }
}

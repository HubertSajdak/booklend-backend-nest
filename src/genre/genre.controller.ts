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
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './input/create-genre.dto';
import { Genre } from './schemas/genre.schema';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Genres')
@Controller('genres')
export class GenreController {
  constructor(private genreService: GenreService) {}
  @UseGuards(AuthGuardJwt)
  @Post()
  createGenre(
    @I18n() i18n: I18nContext,
    @Body() input: CreateGenreDto,
  ): Promise<{ message: string }> {
    return this.genreService.createGenre(i18n, input);
  }
  @UseGuards(AuthGuardJwt)
  @Put(':id')
  updateGenre(
    @I18n() i18n: I18nContext,
    @Param() params: any,
    @Body() input: CreateGenreDto,
  ): Promise<{ message: string }> {
    return this.genreService.updateGenre(params, i18n, input);
  }
  @UseGuards(AuthGuardJwt)
  @Delete(':id')
  deleteGenre(
    @I18n() i18n: I18nContext,
    @Param() params: any,
  ): Promise<{ message: string }> {
    return this.genreService.deleteGenre(params, i18n);
  }
  @UseGuards(AuthGuardJwt)
  @Get()
  getAllGenres(@I18n() i18n: I18nContext): Promise<Genre[]> {
    return this.genreService.getAllGenres(i18n);
  }
  @UseGuards(AuthGuardJwt)
  @Get(':id')
  getSingleGenre(
    @Param() params: any,
    @I18n() i18n: I18nContext,
  ): Promise<Genre> {
    return this.genreService.getSingleGenre(params, i18n);
  }
}

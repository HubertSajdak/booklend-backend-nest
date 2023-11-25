import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreateGenreDto } from './input/create-genre.dto';
import { Genre } from './schemas/genre.schema';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name)
    private readonly genreModel: Model<Genre>,
  ) {}

  async createGenre(
    @I18n() i18n: I18nContext,
    input: CreateGenreDto,
  ): Promise<{ message: string }> {
    Logger.log(input);
    const { genreTranslationKey } = input;
    if (!genreTranslationKey) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('genre.requiredGenreTranslationKey')],
      });
    }
    const existingGenre = await this.genreModel.findOne({
      genreTranslationKey: genreTranslationKey.toLowerCase(),
    });
    if (existingGenre) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('genre.genreAlreadyExists')],
      });
    }
    await this.genreModel.create({
      genreTranslationKey: genreTranslationKey.toLowerCase(),
    });
    return { message: i18n.t('genre.genreCreated') };
  }
  async updateGenre(
    params,
    @I18n() i18n: I18nContext,
    input: CreateGenreDto,
  ): Promise<{ message: string }> {
    const { id } = params;
    const { genreTranslationKey } = input;
    const existingGenreId = await this.genreModel.findOne({
      _id: id,
    });
    if (!existingGenreId) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('genre.genreNotFound')],
      });
    }
    const existingGenreKey = await this.genreModel.findOne({
      genreTranslationKey: genreTranslationKey.toLowerCase(),
    });
    if (existingGenreKey) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('genre.genreAlreadyExists')],
      });
    }
    await this.genreModel.updateOne(
      { _id: id },
      { genreTranslationKey: genreTranslationKey.toLowerCase() },
    );
    return { message: i18n.t('genre.genreUpdated') };
  }
  async deleteGenre(
    params,
    @I18n() i18n: I18nContext,
  ): Promise<{ message: string }> {
    const { id } = params;
    const existingGenreId = await this.genreModel.findOne({
      _id: id,
    });
    if (!existingGenreId) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('genre.genreNotFound')],
      });
    }
    await this.genreModel.deleteOne({ _id: id });
    return { message: i18n.t('genre.genreRemoved') };
  }
  async getAllGenres(@I18n() i18n: I18nContext): Promise<Genre[]> {
    const existingGenres = await this.genreModel.find({});
    if (!existingGenres) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('genre.genresNotFound')],
      });
    }
    return existingGenres;
  }
  async getSingleGenre(params, @I18n() i18n: I18nContext): Promise<Genre> {
    const { id } = params;

    const existingGenres = await this.genreModel.findOne({ _id: id });
    if (!existingGenres) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('genre.genreNotFound')],
      });
    }
    return existingGenres;
  }
}

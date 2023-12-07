import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreateReaderDto } from './input/create-reader.dto';
import { Reader } from './schemas/reader.schema';

@Injectable()
export class ReaderService {
  constructor(
    @InjectModel(Reader.name)
    private readonly readerModel: Model<Reader>,
  ) {}

  async createReader(
    req,
    @I18n() i18n: I18nContext,
    input: CreateReaderDto,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    const { firstName, lastName, address, phoneNumber } = input;
    if (!firstName || !lastName || !address || !phoneNumber) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('validation.common.badObject')],
      });
    }
    await this.readerModel.create({ ...input, adminId: userId });
    return { message: i18n.t('reader.readerCreated') };
  }
  async updateReader(
    params,
    @I18n() i18n: I18nContext,
    input: CreateReaderDto,
  ): Promise<{ message: string }> {
    const { id } = params;
    const { firstName, lastName, address, phoneNumber } = input;
    if (!firstName || !lastName || !address || !phoneNumber) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('validation.common.badObject')],
      });
    }
    const existingReader = await this.readerModel.findOne({ _id: id });
    if (!existingReader) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('reader.readerNotFound')],
      });
    }
    await this.readerModel.updateOne({ _id: id }, { ...input });
    return { message: i18n.t('reader.readerUpdated') };
  }

  async deleteReader(
    params,
    @I18n() i18n: I18nContext,
  ): Promise<{ message: string }> {
    const { id } = params;
    const existingReader = await this.readerModel.findOne({ _id: id });
    if (!existingReader) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('reader.readerNotFound')],
      });
    }
    await this.readerModel.deleteOne({ _id: id });
    return { message: i18n.t('reader.readerRemoved') };
  }
  async getSingleReader(params, @I18n() i18n: I18nContext): Promise<Reader> {
    const { id } = params;
    const existingReader = await this.readerModel.findOne({ _id: id });
    if (!existingReader) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('reader.readerNotFound')],
      });
    }
    return existingReader;
  }
  async getAllReaders(
    query,
    req,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: Reader[]; totalItems: number; numOfPages: number }> {
    const { userId } = req.user;
    const { search, sortBy, sortDirection, pageSize, currentPage } = query;
    const page = Number(currentPage) || 1;
    const limit = Number(pageSize) || 10;
    const skip = (page - 1) * limit;
    const isAsc = sortDirection === 'asc' ? '' : '-';
    const existingReaders = await this.readerModel
      .find(
        search
          ? {
              adminId: userId,
              $expr: {
                $regexMatch: {
                  input: { $concat: ['$firstName', ' ', '$lastName'] },
                  regex: search,
                  options: 'i',
                },
              },
            }
          : { adminId: userId },
      )
      .sort(isAsc + `${sortBy}`)
      .skip(skip)
      .limit(limit);
    if (!existingReaders) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('reader.readerNotFound')],
      });
    }
    const totalReaders = await this.readerModel.countDocuments(
      search
        ? {
            adminId: userId,
            $expr: {
              $regexMatch: {
                input: { $concat: ['$firstName', ' ', '$lastName'] },
                regex: search,
                options: 'i',
              },
            },
          }
        : { adminId: userId },
    );
    const numOfPages = Math.ceil(totalReaders / limit);

    return { data: existingReaders, totalItems: totalReaders, numOfPages };
  }
  async uploadReaderPhoto(@I18n() i18n: I18nContext, params, file) {
    const { id } = params;
    try {
      const existingBook = await this.readerModel.findOne({ _id: id });
      if (!existingBook) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Not Found',
          errors: [i18n.t('book.bookNotFound')],
        });
      }
      if (!file) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Bad Request',
          errors: [i18n.t('validation.file.noFileUploaded')],
        });
      }
      if (!file.mimetype.startsWith('image')) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Bad Request',
          errors: [i18n.t('validation.file.badFormat')],
        });
      }
      const filePath = `/uploads/${file.originalname}`;
      await this.readerModel.updateOne({ _id: id }, { photo: filePath });
      return {
        status: 201,
        message: i18n.t('validation.file.fileUploadedSuccessfully'),
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 500,
        message: 'Internal Server Error',
        errors: [i18n.t('validation.file.somethingWentWrong')],
      });
    }
  }
}

import {
  BadRequestException,
  Injectable,
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
  async getAllReaders(req, @I18n() i18n: I18nContext): Promise<Reader[]> {
    const { userId } = req.user;
    const existingReaders = await this.readerModel.find({ adminId: userId });
    if (!existingReaders) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('reader.readerNotFound')],
      });
    }
    return existingReaders;
  }
}

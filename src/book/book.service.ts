import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreateBookDto } from './input/create-book.dto';
import { UpdateBookDto } from './input/update-book.dto';
import { Book } from './schemas/book.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>,
  ) {}

  async createBook(
    req,
    @I18n() i18n: I18nContext,
    input: CreateBookDto,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    const { title, description, rating, genre, author, numberOfPages } = input;
    if (
      !title ||
      !description ||
      !rating ||
      !genre ||
      !author ||
      !numberOfPages
    ) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('validation.common.badObject')],
      });
    }
    await this.bookModel.create({ ...input, adminId: userId });
    return { message: i18n.t('book.bookCreated') };
  }

  async updateBook(
    @I18n() i18n: I18nContext,
    params,
    input: UpdateBookDto,
  ): Promise<{ message: string }> {
    const { id } = params;
    Logger.log(params);
    const { title, description, rating, genre, author, numberOfPages } = input;
    if (
      !title ||
      !description ||
      !rating ||
      !genre ||
      !author ||
      !numberOfPages
    ) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('validation.common.badObject')],
      });
    }
    const existingBook = await this.bookModel.findOne({ _id: id });
    if (!existingBook) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('book.bookNotFound')],
      });
    }
    await this.bookModel.updateOne({ _id: id }, { ...input });
    return { message: i18n.t('book.bookUpdated') };
  }

  async deleteBook(
    @I18n() i18n: I18nContext,
    params,
  ): Promise<{ message: string }> {
    const { id } = params;
    const existingBook = await this.bookModel.findOne({ _id: id });
    if (!existingBook) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('book.bookNotFound')],
      });
    }
    await this.bookModel.deleteOne({ _id: id });
    return { message: i18n.t('book.bookDeleted') };
  }
  async getSingleBook(@I18n() i18n: I18nContext, params): Promise<Book> {
    const { id } = params;
    const existingBook = await this.bookModel.findOne({ _id: id });
    if (!existingBook) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('book.bookNotFound')],
      });
    }
    return existingBook;
  }
  async getAllBooks(req, @I18n() i18n: I18nContext): Promise<Book[]> {
    const { userId } = req.user;
    const existingBooks = await this.bookModel.find({ adminId: userId });
    if (!existingBooks) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('book.booksNotFound')],
      });
    }
    return existingBooks;
  }
}

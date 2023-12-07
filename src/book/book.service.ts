import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
  async getAllBooks(
    query,
    req,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: Book[]; totalItems: number; numOfPages: number }> {
    const { userId } = req.user;
    const { search, sortBy, sortDirection, pageSize, currentPage } = query;
    const page = Number(currentPage) || 1;
    const limit = Number(pageSize) || 10;
    const skip = (page - 1) * limit;
    const isAsc = sortDirection === 'asc' ? '' : '-';
    const existingBooks = await this.bookModel
      .find(
        search
          ? {
              adminId: userId,
              $expr: {
                $regexMatch: {
                  input: { $concat: ['$title', ' ', '$author'] },
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

    if (!existingBooks) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('book.booksNotFound')],
      });
    }
    const totalBooks = await this.bookModel.countDocuments(
      search
        ? {
            adminId: userId,
            $expr: {
              $regexMatch: {
                input: { $concat: ['$title', ' ', '$author'] },
                regex: search,
                options: 'i',
              },
            },
          }
        : { adminId: userId },
    );
    const numOfPages = Math.ceil(totalBooks / limit);
    return { data: existingBooks, totalItems: totalBooks, numOfPages };
  }
  async uploadBookPhoto(@I18n() i18n: I18nContext, params, file) {
    const { id } = params;
    try {
      const existingBook = await this.bookModel.findOne({ _id: id });
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
      await this.bookModel.updateOne({ _id: id }, { photo: filePath });
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

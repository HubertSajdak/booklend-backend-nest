import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18n, I18nContext, i18nValidationMessage } from 'nestjs-i18n';
import { Book } from 'src/book/schemas/book.schema';
import { Reader } from 'src/reader/schemas/reader.schema';
import { CreateLendBookDto } from './input/create-lend-book.dto';
import { LendBook } from './schemas/lend-book.schema';

@Injectable()
export class LendBookService {
  constructor(
    @InjectModel(LendBook.name)
    private readonly lendBookModel: Model<LendBook>,
    @InjectModel(Reader.name)
    private readonly readerModel: Model<Reader>,
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>,
  ) {}
  async createLendedBook(
    req,
    @I18n() i18n: I18nContext,
    input: CreateLendBookDto,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    const { bookId, readerId, lendFrom, lendTo, lendStatus } = input;
    if (!bookId || !readerId || !lendFrom || !lendTo || !lendStatus) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('validation.common.badObject')],
      });
    }
    const existingReader = await this.readerModel.findOne({ _id: readerId });
    if (!existingReader) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('reader.readerNotFound')],
      });
    }
    const existingBook = await this.bookModel.findOne({
      _id: bookId,
    });
    if (!existingBook) {
      throw new NotFoundException({
        status: 404,
        message: 'Not found',
        errors: [i18n.t('book.bookNotFound')],
      });
    }
    const existingLendedBook = await this.lendBookModel.findOne({ bookId });
    if (existingLendedBook && existingLendedBook.lendStatus === 'borrowed') {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('lendBook.bookAlreadyLended')],
      });
    }
    await this.lendBookModel.create({
      ...input,
      adminId: userId,
      readerData: existingReader,
      bookData: existingBook,
      lendFrom: new Date(lendFrom),
      lendTo: new Date(lendTo),
    });
    return { message: i18n.t('lendBook.createLendBook') };
  }
  async updateLendedBook(
    params,
    @I18n() i18n: I18nContext,
    input: CreateLendBookDto,
  ): Promise<{ message: string }> {
    const { id } = params;
    const { bookId, readerId, lendFrom, lendTo, lendStatus } = input;
    if (!bookId || !readerId || !lendFrom || !lendTo || !lendStatus) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18nValidationMessage('validation.common.badObject')],
      });
    }
    const existingReader = await this.readerModel.findOne({ _id: readerId });
    if (!existingReader) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Bad Request',
        errors: [i18n.t('reader.readerNotFound')],
      });
    }
    const existingLendedBook = await this.lendBookModel.findOne({ _id: id });
    if (!existingLendedBook) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Bad Request',
        errors: [i18n.t('lendBook.noLendBooks')],
      });
    }
    await this.lendBookModel.updateOne(
      { _id: id },
      { ...input, lendFrom: new Date(lendFrom), lendTo: new Date(lendTo) },
    );
    return { message: i18n.t('lendBook.updatedLendBook') };
  }
  async getAllLendedBooks(
    query,
    req,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: LendBook[]; totalItems: number; numOfPages: number }> {
    const { userId } = req.user;
    const { sortBy, sortDirection, pageSize, currentPage, lendStatus } = query;
    const page = Number(currentPage) || 1;
    const limit = Number(pageSize) || 10;
    const skip = (page - 1) * limit;
    const isAsc = sortDirection === 'asc' ? '' : '-';
    const existingLendBooks = await this.lendBookModel
      .find({
        adminId: userId,
        ...(lendStatus &&
          lendStatus !== 'all' && {
            lendStatus,
          }),
      })
      .sort(isAsc + `${sortBy}`)
      .skip(skip)
      .limit(limit);
    if (!existingLendBooks) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('lendBook.noLendBooks')],
      });
    }
    const totalLendBooks = await this.lendBookModel.countDocuments({
      adminId: userId,
      ...(lendStatus &&
        lendStatus !== 'all' && {
          lendStatus,
        }),
    });
    const numOfPages = Math.ceil(totalLendBooks / limit);

    return { data: existingLendBooks, totalItems: totalLendBooks, numOfPages };
  }
  async getReaderLendedBooks(
    query,
    params,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: LendBook[]; totalItems: number; numOfPages: number }> {
    const { id } = params;
    const { sortBy, sortDirection, pageSize, currentPage, lendStatus } = query;
    const page = Number(currentPage) || 1;
    const limit = Number(pageSize) || 10;
    const skip = (page - 1) * limit;
    const isAsc = sortDirection === 'asc' ? '' : '-';
    const existingLendBooks = await this.lendBookModel
      .find({
        readerId: id,
        ...(lendStatus &&
          lendStatus !== 'all' && {
            lendStatus,
          }),
      })
      .sort(isAsc + `${sortBy}`)
      .skip(skip)
      .limit(limit);
    if (!existingLendBooks) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('lendBook.noLendBooks')],
      });
    }
    const totalReaderLendBooks = await this.lendBookModel.countDocuments({
      readerId: id,
      ...(lendStatus &&
        lendStatus !== 'all' && {
          lendStatus,
        }),
    });
    const numOfPages = Math.ceil(totalReaderLendBooks / limit);

    return {
      data: existingLendBooks,
      totalItems: totalReaderLendBooks,
      numOfPages,
    };
  }
  async getBookLendHistory(
    query,
    params,
    @I18n() i18n: I18nContext,
  ): Promise<{ data: LendBook[]; totalItems: number; numOfPages: number }> {
    const { id } = params;
    const { sortBy, sortDirection, pageSize, currentPage, lendStatus } = query;
    const page = Number(currentPage) || 1;
    const limit = Number(pageSize) || 10;
    const skip = (page - 1) * limit;
    const isAsc = sortDirection === 'asc' ? '' : '-';
    const existingLendBooks = await this.lendBookModel
      .find({
        bookId: id,
        ...(lendStatus &&
          lendStatus !== 'all' && {
            lendStatus,
          }),
      })
      .sort(isAsc + `${sortBy}`)
      .skip(skip)
      .limit(limit);
    if (!existingLendBooks) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('lendBook.noLendBooks')],
      });
    }
    const totalBookLendHistory = await this.lendBookModel.countDocuments({
      bookId: id,
      ...(lendStatus &&
        lendStatus !== 'all' && {
          lendStatus,
        }),
    });
    const numOfPages = Math.ceil(totalBookLendHistory / limit);

    return {
      data: existingLendBooks,
      totalItems: totalBookLendHistory,
      numOfPages,
    };
  }

  async getSingleLendedBook(
    params,
    @I18n() i18n: I18nContext,
  ): Promise<LendBook> {
    const { id } = params;
    const existingLendBook = await this.lendBookModel.findOne({ _id: id });
    if (!existingLendBook) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('lendBook.noLendBooks')],
      });
    }
    return existingLendBook;
  }
}

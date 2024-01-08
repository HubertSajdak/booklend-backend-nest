import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date } from 'mongoose';
import { Book } from 'src/book/schemas/book.schema';
import { Reader } from 'src/reader/schemas/reader.schema';

@Schema({
  timestamps: true,
})
export class LendBook {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'required field'],
  })
  adminId: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'required field'],
  })
  bookId: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'required field'],
  })
  readerId: mongoose.Types.ObjectId;
  @Prop({
    type: Date,
    required: [true, 'required field'],
  })
  lendFrom: Date;
  @Prop({
    type: Date,
    required: [true, 'required field'],
  })
  lendTo: Date;
  @Prop({
    type: String,
    enum: ['borrowed', 'available'],
    required: [true, 'required field'],
    default: 'available',
  })
  lendStatus: string;
  @Prop({
    type: Reader,
    required: [true, 'required field'],
  })
  readerData: Reader;
  @Prop({
    type: Book,
    required: [true, 'required field'],
  })
  bookData: Book;
}

const LendBookSchema = SchemaFactory.createForClass(LendBook);
export { LendBookSchema };

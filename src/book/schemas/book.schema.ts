import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({
  timestamps: true,
})
export class Book {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'required field'],
  })
  adminId: mongoose.Types.ObjectId;
  @Prop({
    type: String,
    required: [true, 'required first name'],
    minLength: [2, 'minimum 2 characters'],
  })
  title: string;
  @Prop({
    type: String,
    required: [true, 'required field'],
    minLength: [10, 'minimum 10 characters'],
  })
  description: string;
  @Prop({
    type: String,
    required: [true, 'required field'],
    minLength: [2, 'minimum 2 characters'],
  })
  author: string;
  @Prop({
    type: Number,
    required: [true, 'required field'],
    min: 1,
    max: 5,
    default: 1,
  })
  rating: string;
  @Prop({
    type: [String],
    required: [true, 'required field'],
  })
  genre: string[];
  @Prop({
    type: Number,
    required: [true, 'required field'],
  })
  numberOfPages: number;
  @Prop({
    type: String,
    default: null,
  })
  photo?: string;
}

const BookSchema = SchemaFactory.createForClass(Book);
export { BookSchema };

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

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
    type: String,
    required: [true, 'required field'],
  })
  lendFrom: string;
  @Prop({
    type: String,
    required: [true, 'required field'],
  })
  lendTo: string;
  @Prop({
    type: String,
    enum: ['borrowed', 'available'],
    required: [true, 'required field'],
    default: 'available',
  })
  lendStatus: string;
}

const LendBookSchema = SchemaFactory.createForClass(LendBook);
export { LendBookSchema };

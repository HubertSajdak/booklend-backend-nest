import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({
  timestamps: true,
})
export class Reader {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'required field'],
  })
  adminId: mongoose.Types.ObjectId;
  @Prop({
    type: String,
    required: [true, 'required field'],
  })
  firstName: string;
  @Prop({
    type: String,
    required: [true, 'required field'],
  })
  lastName: string;
  @Prop({
    type: String,
    required: [true, 'required field'],
    minLength: [9, 'min length 9'],
    maxLength: [9, 'max length 9'],
  })
  phoneNumber: string;
  @Prop(
    raw({
      street: { type: String, required: [true, 'Required field'] },
      city: { type: String, required: [true, 'Required field'] },
      postalCode: {
        type: String,
        maxlength: [6, 'has to be 6 characters long'],
        minlength: [6, 'has to be 6 characters long'],
        required: [true, 'Required field'],
      },
    }),
  )
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  @Prop({
    type: String,
    default: null,
  })
  photo?: string;
}

const ReaderSchema = SchemaFactory.createForClass(Reader);
export { ReaderSchema };

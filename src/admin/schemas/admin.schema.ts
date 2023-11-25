import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({
  timestamps: true,
})
export class Admin {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: String,
    required: [true, 'required first name'],
    minLength: [2, 'minimum 2 characters'],
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
  })
  email: string;
  @Prop({
    type: String,
    required: [true, 'required field'],
  })
  password: string;
  @Prop({
    type: String,
    default: null,
  })
  photo?: string;
}

const AdminSchema = SchemaFactory.createForClass(Admin);
export { AdminSchema };

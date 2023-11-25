import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({
  timestamps: true,
})
export class Genre {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: String,
    required: [true, 'required field'],
  })
  genreTranslationKey: string;
}

const GenreSchema = SchemaFactory.createForClass(Genre);
export { GenreSchema };

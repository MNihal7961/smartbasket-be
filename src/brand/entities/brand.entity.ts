import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Brand extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  logo?: string;

  @Prop([String])
  categories: string[];

}

export const BrandSchema = SchemaFactory.createForClass(Brand);

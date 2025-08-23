import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Category } from 'src/modules/category/schema/category.schema';
import { Gender } from 'src/modules/product/enum/gender.enum';

export class AttributeVariant {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  option: string;
}

export class ProductVariant {
  @Prop([AttributeVariant])
  attributes: AttributeVariant[];

  @Prop()
  image?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;
}

export class VariantOption {
  @Prop({ required: true })
  option: string;

  @Prop()
  image?: string;
}

export class VariantStructure {
  @Prop({ required: true })
  title: string;

  @Prop()
  enableImage?: boolean;

  @Prop({ type: [VariantOption], default: [] })
  options: VariantOption[];
}

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ enum: Gender, default: Gender.UNISEX })
  gender: Gender;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop([String])
  images: string[];

  @Prop([String])
  descriptionImages: string[];

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ default: 0 })
  sold: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  discount?: number;

  @Prop()
  weight?: number;

  @Prop({ default: true })
  active: boolean;

  @Prop([ProductVariant])
  variants: ProductVariant[];

  @Prop({ type: [VariantStructure], default: [] })
  variantStructure: VariantStructure[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

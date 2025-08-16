import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  AttributeVariant,
  Product,
} from 'src/modules/product/schema/product.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export class CartItemVariant {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  option: string;
}

export class ProductSnapshot {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  discount?: number;
}

@Schema({ timestamps: true })
export class CartItem extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  attributeVariant?: AttributeVariant[];

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: ProductSnapshot, required: true })
  snapshot: ProductSnapshot;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

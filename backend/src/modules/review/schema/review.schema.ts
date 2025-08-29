import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Order } from 'src/modules/orders/schema/order.schema';
import { Product } from 'src/modules/product/schema/product.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export class UserSnapshot {
  fullName: string;
}

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  product: Product;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true })
  order: Order;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: UserSnapshot, required: true })
  userSnapshot: UserSnapshot;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  rating: number;

  @Prop({ type: String })
  content: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String })
  shopReply?: string;

  @Prop({ type: Date })
  shopReplyAt?: Date;
}

export type ReviewDocument = Review & Document;

export const ReviewSchema = SchemaFactory.createForClass(Review);

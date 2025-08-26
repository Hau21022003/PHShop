import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { OrderStatus } from 'src/modules/orders/enum/status.enum';
import {
  AttributeVariant,
  Product,
} from 'src/modules/product/schema/product.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export class ContactDetails {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  ward: string;

  @Prop({ required: true })
  address: string;
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

export class OrderItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop()
  attributeVariant?: AttributeVariant[];

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: ProductSnapshot, required: true })
  productSnapshot: ProductSnapshot;
}

export class StatusHistory {
  @Prop({ type: String, enum: OrderStatus, required: true })
  status: OrderStatus;

  @Prop({ required: true })
  changedAt: Date;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ unique: true })
  code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @Prop({ required: true, min: 0 })
  deliveryPrice: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({ type: [StatusHistory], default: [] })
  statusHistory: StatusHistory[];

  @Prop()
  note: string;

  @Prop({ type: ContactDetails, required: true })
  contactDetails: ContactDetails;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);

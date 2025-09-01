import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/modules/users/enums/role.enum';
import { User } from 'src/modules/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  message: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ enum: Role, required: true })
  fromRole: Role;

  @Prop({ default: false })
  isRead: boolean;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/common/schemas/base.schema';
import { Role } from 'src/modules/users/enums/role.enum';

export type UserDocument = HydratedDocument<User>;
export enum UserType {
  FREE = 'free',
  ENTERPRISE = 'enterprise',
}

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop()
  fullName: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  emailActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

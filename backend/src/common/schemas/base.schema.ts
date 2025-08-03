// common/schemas/base.schema.ts
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export abstract class BaseSchema {
  @Prop({ default: () => new Date() })
  createdAt?: Date;

  @Prop({ default: () => new Date() })
  updatedAt?: Date;

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop()
  createdBy?: Types.ObjectId; // nếu có auth
}

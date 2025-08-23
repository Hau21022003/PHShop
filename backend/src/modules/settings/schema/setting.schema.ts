import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SettingKey } from 'src/modules/settings/enum/setting-key.enum';

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true, unique: true, enum: SettingKey })
  key: SettingKey;

  @Prop({ required: true })
  value: string;

  @Prop({ default: 'string', enum: ['string', 'number', 'boolean', 'json'] })
  type: string;
}

export type SettingDocument = Setting & Document;

export const SettingSchema = SchemaFactory.createForClass(Setting);

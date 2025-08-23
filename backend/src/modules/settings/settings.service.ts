import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Setting } from 'src/modules/settings/schema/setting.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
  ) {}

  async get(key: string): Promise<any> {
    const setting = await this.settingModel.findOne({ key }).exec();
    if (!setting) throw new NotFoundException(`Setting key ${key} not found`);

    switch (setting.type) {
      case 'number':
        return Number(setting.value);
      case 'boolean':
        return setting.value === 'true';
      case 'json':
        return JSON.parse(setting.value);
      default:
        return setting.value;
    }
  }

  async set(key: string, value: any, type: string = 'string') {
    let strValue = value;

    if (typeof value === 'object') {
      strValue = JSON.stringify(value);
      type = 'json';
    } else if (typeof value === 'boolean') {
      strValue = value ? 'true' : 'false';
      type = 'boolean';
    } else if (typeof value === 'number') {
      strValue = value.toString();
      type = 'number';
    }

    return this.settingModel
      .findOneAndUpdate(
        { key },
        { key, value: strValue, type },
        { upsert: true, new: true },
      )
      .exec();
  }
}

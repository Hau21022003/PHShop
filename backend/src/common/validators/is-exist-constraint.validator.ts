import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ModuleRef } from '@nestjs/core';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsExistConstraint implements ValidatorConstraintInterface {
  constructor(private moduleRef: ModuleRef) {}

  async validate(value: any, args: ValidationArguments) {
    const [ModelClass, field = '_id'] = args.constraints;

    try {
      // Lấy model token từ class name hoặc model name
      const modelName =
        typeof ModelClass === 'string' ? ModelClass : ModelClass.name;
      const model = this.moduleRef.get<Model<any>>(getModelToken(modelName), {
        strict: false,
      });

      // Tạo query object
      const query = { [field]: value };

      // Kiểm tra record có tồn tại không
      const record = await model.findOne(query).lean().exec();
      return !!record;
    } catch (error) {
      console.error('Error in IsExistConstraint:', error);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [ModelClass, field = '_id'] = args.constraints;
    const modelName =
      typeof ModelClass === 'string' ? ModelClass : ModelClass.name;
    return `${field} does not exist in ${modelName}`;
  }
}

// Decorator function
export function IsExists(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  model: string | Function, // Model name string hoặc Model class
  field?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [model, field],
      validator: IsExistConstraint,
    });
  };
}

import {
  ValidationPipe,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const CustomValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: false,
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const formattedErrors = errors.map((err) => ({
      field: err.property,
      messages: Object.values(err.constraints || {}),
    }));
    return new UnprocessableEntityException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: formattedErrors,
      message: 'Unprocessable Entity',
    });
  },
});

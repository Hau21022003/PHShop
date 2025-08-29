import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';
import { IsExists } from 'src/common/validators/is-exist-constraint.validator';
import { Order } from 'src/modules/orders/schema/order.schema';
import { Product } from 'src/modules/product/schema/product.schema';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsMongoId()
  @IsExists(Product)
  product: string;

  @IsNotEmpty()
  @IsMongoId()
  @IsExists(Order)
  order: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

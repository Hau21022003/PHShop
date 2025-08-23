import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsExists } from 'src/common/validators/is-exist-constraint.validator';
import { Product } from 'src/modules/product/schema/product.schema';

export class OrderItemDto {
  @IsMongoId()
  @IsExists(Product)
  product: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class ShippingFeeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsNotEmpty()
  districtId: string;

  @IsString()
  @IsNotEmpty()
  provinceId: string;

  @IsString()
  @IsOptional()
  wardId: string;
}

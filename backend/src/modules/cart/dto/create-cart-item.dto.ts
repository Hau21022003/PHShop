import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsExists } from 'src/common/validators/is-exist-constraint.validator';
import { Product } from 'src/modules/product/schema/product.schema';

export class CartItemVariantDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  option: string;
}

export class ProductSnapshotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  discount?: number;
}

export class CreateCartItemDto {
  @IsMongoId()
  @IsExists(Product)
  @IsNotEmpty()
  product: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemVariantDto)
  @IsOptional()
  attributeVariant?: CartItemVariantDto[];

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ValidateNested()
  @Type(() => ProductSnapshotDto)
  @IsNotEmpty()
  snapshot: ProductSnapshotDto;
}

import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsExists } from 'src/common/validators/is-exist-constraint.validator';
import { StatusOrders } from 'src/modules/orders/enum/status.enum';
import { User } from 'src/modules/users/schemas/user.schema';

export class ContactDetailsDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  ward: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class ProductSnapshotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}

export class CartItemVariantDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  option: string;
}

export class OrderItemDto {
  @IsMongoId()
  product: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemVariantDto)
  @IsOptional()
  attributeVariant?: CartItemVariantDto[];

  @IsNumber()
  @Min(1)
  quantity: number;

  // @ValidateNested()
  // @Type(() => ProductSnapshotDto)
  // productSnapshot: ProductSnapshotDto;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // @IsMongoId()
  // @IsExists(User)
  @IsOptional()
  user?: string;

  // @IsNumber()
  // @Min(0)
  // totalAmount: number;

  // @IsNumber()
  // @Min(0)
  // deliveryPrice: number;

  // @IsEnum(StatusOrders)
  // @IsOptional()
  // status?: StatusOrders;

  @IsString()
  @IsOptional()
  note: string;

  @ValidateNested()
  @Type(() => ContactDetailsDto)
  contactDetails: ContactDetailsDto;
}

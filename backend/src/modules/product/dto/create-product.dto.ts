import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsExists } from 'src/common/validators/is-exist-constraint.validator';
import { Category } from 'src/modules/category/schema/category.schema';
import { Gender } from 'src/modules/product/enum/gender.enum';

export class AttributeVariantDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  option: string;
}

export class CreateProductVariant {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeVariantDto)
  attributes: AttributeVariantDto[];

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  quantity: number;
}

export class VariantOptionDto {
  @IsString()
  @IsNotEmpty()
  option: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class VariantStructureDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsBoolean()
  enableImage?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantOptionDto)
  options: VariantOptionDto[];
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  discount: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  quantity: number;

  @IsOptional()
  @IsExists(Category)
  category: string;

  @IsArray()
  images: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariant)
  @IsOptional()
  variants?: CreateProductVariant[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantStructureDto)
  @IsOptional()
  variantStructure: VariantStructureDto[];
}

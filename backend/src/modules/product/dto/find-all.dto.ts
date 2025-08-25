import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Gender } from 'src/modules/product/enum/gender.enum';

export enum PriceFilter {
  BELOW_200K = 'BELOW_200K',
  FROM_200K_TO_400K = 'FROM_200K_TO_400K',
  FROM_400K_TO_600K = 'FROM_400K_TO_600K',
  FROM_600K_TO_800K = 'FROM_600K_TO_800K',
  ABOVE_800K = 'ABOVE_800K',
}

export enum SortBy {
  FEATURED = 'FEATURED',
  NEWEST = 'NEWEST',
  PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
  PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
}

class FilterDto {
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsNotEmpty()
  @IsArray()
  categoryIds: string[];

  @IsNotEmpty()
  @IsEnum(PriceFilter, { each: true })
  price: PriceFilter[];

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsOptional()
  @IsBoolean()
  sale?: Boolean;
}

export class FindAllDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsOptional()
  @Type(() => FilterDto)
  filter?: FilterDto;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

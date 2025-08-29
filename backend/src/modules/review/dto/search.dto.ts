import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { IsExists } from 'src/common/validators/is-exist-constraint.validator';
import { Product } from 'src/modules/product/schema/product.schema';

export enum ReviewSearchStatus {
  ALL = 'ALL',
  ONE_STAR = 'ONE_STAR',
  TWO_STAR = 'TWO_STAR',
  THREE_STAR = 'THREE_STAR',
  FOUR_STAR = 'FOUR_STAR',
  FIVE_STAR = 'FIVE_STAR',
  WITH_IMAGES = 'WITH_IMAGES',
}

export class FindByProductDto {
  @IsOptional()
  @IsEnum(ReviewSearchStatus)
  status?: ReviewSearchStatus;

  @IsMongoId()
  @IsNotEmpty()
  @IsExists(Product)
  productId: string;
}

import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateProductVariant } from 'src/modules/product/dto/create-product.dto';

export class UpdateStockDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariant)
  @IsNotEmpty()
  variants?: CreateProductVariant[];
}

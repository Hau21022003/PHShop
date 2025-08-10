import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class FindAllDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search: string;
}

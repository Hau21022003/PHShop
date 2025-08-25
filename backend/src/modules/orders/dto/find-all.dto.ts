import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { OrderStatus } from 'src/modules/orders/enum/status.enum';

export enum DateFilter {
  TODAY = 'Today',
  YESTERDAY = 'Yesterday',
  LAST_7_DAYS = 'Last 7 days',
  LAST_30_DAYS = 'Last 30 days',
  THIS_MONTH = 'This month',
  LAST_MONTH = 'Last month',
  THIS_YEAR = 'This year',
  LAST_YEAR = 'Last year',
  ALL_TIME = 'All time',
}

export class FindAllDto extends PaginationQueryDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsEnum(DateFilter)
  @IsOptional()
  dateFilter?: DateFilter;

  @IsString()
  @IsOptional()
  search?: string;
}

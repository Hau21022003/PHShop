import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export enum ReplyStatus {
  PENDING = 'PENDING',
  REPLIED = 'REPLIED',
}

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
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsEnum(ReplyStatus)
  @IsOptional()
  replyStatus?: ReplyStatus;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(DateFilter)
  @IsOptional()
  dateFilter?: DateFilter;
}

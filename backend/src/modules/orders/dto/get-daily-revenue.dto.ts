import { Transform } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';

export class GetDailyRevenueDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;
}

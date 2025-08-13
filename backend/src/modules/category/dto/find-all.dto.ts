import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum Status {
  ALL = 'all',
  ACTIVE = 'active',
  DEACTIVE = 'deactive',
}
export class FindAllDto {
  @IsOptional()
  @IsString()
  search: string = '';

  @IsEnum(Status)
  @IsOptional()
  status: Status = Status.ALL;
}

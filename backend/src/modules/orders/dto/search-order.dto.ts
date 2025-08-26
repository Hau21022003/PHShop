import { IsNotEmpty, IsString } from 'class-validator';

export class SearchOrderDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

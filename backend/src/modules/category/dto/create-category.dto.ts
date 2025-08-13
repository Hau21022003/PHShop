import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  active: boolean = true;
}

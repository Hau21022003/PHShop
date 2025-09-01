import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyDto {
  @IsNotEmpty()
  @IsString()
  shopReply: string;
}

import { IsMongoId, IsNotEmpty } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { IsExists } from 'src/common/validators/is-exist-constraint.validator';
import { User } from 'src/modules/users/schemas/user.schema';

export class FindByUserDto extends PaginationQueryDto {
  @IsMongoId()
  @IsNotEmpty()
  @IsExists(User)
  userId: string;
}

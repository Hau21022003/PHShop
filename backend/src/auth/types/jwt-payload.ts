import { Role } from 'src/modules/users/enums/role.enum';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};

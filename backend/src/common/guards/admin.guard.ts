import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwt-payload';
// import { JwtPayload } from 'src/auth/strategies/jwt.strategy';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userPayload: JwtPayload = request.user;
    const user = await this.usersService.findOne(userPayload.sub);
    if (!user || user.role !== 'admin') return false;
    return true;
  }
}

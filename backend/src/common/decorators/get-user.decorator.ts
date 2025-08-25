import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwt-payload';

export const GetUser = createParamDecorator(
  // (data: string | undefined, ctx: ExecutionContext) => {
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

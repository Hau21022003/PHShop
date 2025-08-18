import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Req,
  Res,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  // @Public()
  // @Get('verify-email/:token')
  // verifyEmail(@Param('token') token: string) {
  //   return this.authService.verifyEmail(token);
  // }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@GetUser() user) {
    return this.authService.signIn(user);
  }

  @Get('logout')
  logout(@GetUser('sub') userId) {
    this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Request() req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Public()
  @Get('forgot-password/:email')
  forgotPassword(@Param('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('Google auth endpoint hit');
  }

  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.loginWithGoogle(req.user);
    res.redirect(
      `${this.configService.get('CLIENT_URL')}/google/success?accessToken=${tokens.accessToken}&accessTokenExpiresAt=${tokens.accessTokenExpiresAt}`,
    );
  }
}

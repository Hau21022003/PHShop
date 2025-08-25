import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import EmailHelper from 'src/common/helper/email.helper';
import { UserDocument } from 'src/modules/users/schemas/user.schema';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { Role } from 'src/modules/users/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const passwordMatches = await bcrypt.compare(pass, user.password);
    if (!passwordMatches) return null;

    if (!user.isActive) {
      throw new BadRequestException(
        'Your account is locked. Please contact support for assistance.',
      );
    }

    return user;
  }

  async signIn(user: UserDocument) {
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      account: user,
      ...tokens,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    // Check if user exists
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const errors = this.validatePasswordStrength(createUserDto.password);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });

    const tokens = await this.getTokens(
      newUser._id.toString(),
      newUser.email,
      newUser.role,
    );
    await this.updateRefreshToken(newUser._id.toString(), tokens.refreshToken);
    return {
      account: newUser,
      ...tokens,
    };
  }

  async logout(userId: string) {
    return await this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.role,
    );
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, email: string, role: Role) {
    const payload: JwtPayload = { sub: userId, email, role };
    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: accessTokenExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTokenExpiresIn,
      }),
    ]);

    const accessTokenExpiresAt =
      this.calculateExpirationDate(accessTokenExpiresIn);
    const refreshTokenExpiresAt = this.calculateExpirationDate(
      refreshTokenExpiresIn,
    );
    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }

  private calculateExpirationDate(expiresIn: string): Date {
    const now = new Date();
    const seconds = this.parseTimeToSeconds(expiresIn);
    return new Date(now.getTime() + seconds * 1000);
  }

  private parseTimeToSeconds(timeString: string): number {
    // Xử lý các format như: '15m', '1h', '7d', '30s'
    const match = timeString.match(/^(\d+)([smhd])$/);
    if (!match) {
      // Nếu là số thuần túy, coi như đã là giây
      return parseInt(timeString, 10);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return parseInt(timeString, 10);
    }
  }

  private validatePasswordStrength(password: string): string[] {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Must contain at least one number');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Must contain at least one special character');
    }

    return errors;
  }

  async loginWithGoogle(user: any) {
    let userExists = await this.usersService.findByEmail(user.email);
    if (!userExists) {
      userExists = await this.usersService.create({
        email: user.email,
        password: 'Abcd123!',
        fullName: `${user.firstName} ${user.lastName}`,
        avatar: user.picture,
      });
    }
    const tokens = await this.getTokens(
      userExists.id,
      userExists.email,
      userExists.role,
    );
    await this.updateRefreshToken(userExists.id, tokens.refreshToken);
    return {
      account: userExists,
      ...tokens,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newPassword = this.generatePassword();
    const hashPassword = await this.hashData(newPassword);
    user.password = hashPassword;
    await this.usersService.update(user.id, user);

    await EmailHelper.sendMail(
      email,
      'Password reset request',
      '',
      newPassword,
    );
    return 'Password reset successfully';
  }

  private generatePassword() {
    const length = 10;

    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+';

    const allChars = lowerCase + upperCase + numbers + specialChars;

    let password = [
      lowerCase[Math.floor(Math.random() * lowerCase.length)],
      upperCase[Math.floor(Math.random() * upperCase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specialChars[Math.floor(Math.random() * specialChars.length)],
    ];

    for (let i = password.length; i < length; i++) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    password = password.sort(() => 0.5 - Math.random());

    return password.join('');
  }

  private async hashData(data: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(data, salt);
  }
}

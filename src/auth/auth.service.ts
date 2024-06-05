import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDto } from './dto/userDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const adminId = '2223f3bc-a6fd-4432-a44b-fb02eaad982c';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const adminUsername =
      this.configService.get<string>('superAdmin.username') ?? '';
    const adminPassword =
      this.configService.get<string>('superAdmin.password') ?? '';
    // await postLoginRequest.validate(req.body); todo
    let user: UserDto | false | undefined;
    if (username === adminUsername) {
      user = this.loginAdmin(username, pass, adminPassword);
      // } else {
      // user = await loginUser(body);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      access_token: await this.jwtService.signAsync(user),
    };
  }

  loginAdmin(
    username: string,
    pass: string,
    expectedPassword: string,
  ): false | UserDto {
    if (expectedPassword === '') {
      console.error('Configured empty super admin password');
      return false;
    }
    if (pass !== expectedPassword) {
      return false;
    }

    return {
      id: adminId,
      username,
    } satisfies UserDto;
  }
}

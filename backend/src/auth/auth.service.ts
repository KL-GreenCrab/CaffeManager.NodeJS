import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string) {
    return this.usersService.validateUser(username, pass);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role?.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

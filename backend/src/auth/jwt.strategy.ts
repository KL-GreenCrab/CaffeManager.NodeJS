import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private usersService: UsersService) {
    const secret = config.get<string>('JWT_SECRET') || 'verysecretkey';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // return full user object (without password) so req.user contains role
  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub as number);
    if (!user) return null;
    // strip password
    const { password, ...rest } = user as any;
    return rest;
  }
}

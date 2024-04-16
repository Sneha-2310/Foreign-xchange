import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (user==undefined) {
      throw new UnauthorizedException();
    }
    if(user!= undefined && user.password==password){
    return user;}
    else {throw new UnauthorizedException();}
  }
}

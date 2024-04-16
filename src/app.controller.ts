
import { Controller, Get, UseGuards,Post, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { RolesGuard } from './user/role.guard';
import { CONSTANTS } from './user/const';

@Controller()
export class AppController {
constructor(private readonly authService:AuthService){}

  @Post('profile')
  @UseGuards(AuthGuard("local"))
  getProfile(@Request()req): string {
    //authentication done
    const token=this.authService.generateToken(req.user);
    return token;
  }

  @Get('admin')
  @UseGuards(AuthGuard("jwt"),new RolesGuard(CONSTANTS.ROLES.ADMIN))
  yyy(@Request()req): string {
    //authorization done
    console.log(req.user);
    return "Access To Admin Only";
  }
  @Get('user')
  @UseGuards(AuthGuard("jwt"),new RolesGuard(CONSTANTS.ROLES.USER))
  xxx(@Request()req): string {
    //authorization done
    console.log(req.user);
    return "Access To User Only";
  }
}

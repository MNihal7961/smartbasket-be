import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    try {
      return await this.authService.register(body);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Public()
  @Post('login')
  async login(@Body() body: SignInUserDto) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}

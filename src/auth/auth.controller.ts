import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: { example: { success: false, message: 'Email already exists' } },
  })
  async register(@Body() body: CreateUserDto) {
    try {
      return await this.authService.register(body);
    } catch (err) {
      return {
        success: false,
        message: 'Registration failed: ' + (err.message || 'Unknown error'),
      };
    }
  }

  @Public()
  @Post('login')
  @ApiBody({ type: SignInUserDto })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials',
    schema: { example: { success: false, message: 'Invalid credentials' } },
  })
  async login(@Body() body: SignInUserDto) {
    try {
      const user = await this.authService.validateUserByEmail(
        body.email,
        body.password,
        'user',
      );
      if (!user) {
        return {
          success: false,
          message: 'Login failed: Invalid email, password, or not a user.',
        };
      }
      return this.authService.login(user);
    } catch (err) {
      return {
        success: false,
        message: 'Login failed: ' + (err.message || 'Unknown error'),
      };
    }
  }

  @Public()
  @Post('admin/login')
  @ApiBody({ type: SignInUserDto })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials',
    schema: { example: { success: false, message: 'Invalid credentials' } },
  })
  async adminLogin(@Body() body: SignInUserDto) {
    try {
      const user = await this.authService.validateUserByEmail(
        body.email,
        body.password,
        'admin',
      );
      if (!user) {
        return {
          success: false,
          message: 'Admin login failed: Invalid credentials or not an admin.',
        };
      }
      return this.authService.login(user);
    } catch (err) {
      return {
        success: false,
        message: 'Admin login failed: ' + (err.message || 'Unknown error'),
      };
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: { example: { success: false, message: 'User not found' } },
  })
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.authService.getUserById(id);
      if (!user) {
        return { success: false, message: 'User not found.' };
      }
      return user;
    } catch (err) {
      return {
        success: false,
        message: 'Failed to fetch user: ' + (err.message || 'Unknown error'),
      };
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('user/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: { example: { success: false, message: 'User not found' } },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: { example: { success: false, message: 'Forbidden' } },
  })
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Req() req: any,
  ) {
    try {
      if (req.user.userId !== id && req.user.role !== 'admin') {
        return {
          success: false,
          message:
            'Update failed: You do not have permission to update this user.',
        };
      }
      const updated = await this.authService.updateUser(id, body);
      if (!updated) {
        return { success: false, message: 'Update failed: User not found.' };
      }
      return updated;
    } catch (err) {
      return {
        success: false,
        message: 'Update failed: ' + (err.message || 'Unknown error'),
      };
    }
  }
}

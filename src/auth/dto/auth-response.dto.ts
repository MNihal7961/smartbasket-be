import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
} 
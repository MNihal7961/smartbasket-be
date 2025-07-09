export class UpdateUserDto {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'user' | 'admin';
} 
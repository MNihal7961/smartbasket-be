export class UpdateUserDto {
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'user' | 'admin';
} 
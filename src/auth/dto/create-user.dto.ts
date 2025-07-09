export class CreateUserDto {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
} 
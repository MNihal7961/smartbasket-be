import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) {
      throw new Error('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new this.userModel({
      ...data,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const { password, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
  }

  /**
   * Validate a user by email and password
   */
  async validateUserByEmail(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    const { password: pw, ...result } = user.toObject();
    return result;
  }

  /**
   * Login: generate token and store it
   */
  async login(user: any): Promise<{ access_token: string }> {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const token = this.jwtService.sign(payload);
    await this.userModel.updateOne({ _id: user._id }, { token });
    return {
      access_token: token,
    };
  }

  /**
   * Optional: Find user by ID
   */
  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findById(userId).select('-password');
    return user ? user.toObject() : null;
  }
}

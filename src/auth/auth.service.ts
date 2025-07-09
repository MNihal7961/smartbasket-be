import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(
    data: CreateUserDto,
  ): Promise<{ access_token: string; user: any }> {
    const email = data.email.toLowerCase();
    // Check for existing user with same email and role
    const existing = await this.userModel.findOne({
      email,
      role: data.role || 'user',
    });
    if (existing) {
      throw new Error('A user with this email and role already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new this.userModel({
      ...data,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const { password, ...userWithoutPassword } = savedUser.toObject();
    const access_token = this.jwtService.sign({
      userId: savedUser._id,
      email: savedUser.email,
      role: savedUser.role,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
    });
    return { access_token, user: userWithoutPassword };
  }

  async validateUserByEmail(
    email: string,
    password: string,
    role?: 'user' | 'admin',
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findOne({
      email: email.toLowerCase(),
      ...(role ? { role } : {}),
    });
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    const { password: pw, ...result } = user.toObject();
    return result;
  }

  async login(user: any): Promise<{ access_token: string; user: any }> {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const access_token = this.jwtService.sign(payload);
    return { access_token, user };
  }

  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findById(userId).select('-password');
    return user ? user.toObject() : null;
  }

  async updateUser(
    userId: string,
    update: UpdateUserDto,
  ): Promise<Omit<User, 'password'> | null> {
    if (update.email) {
      update.email = update.email.toLowerCase();
    }
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, update, { new: true })
      .select('-password');
    return updatedUser ? updatedUser.toObject() : null;
  }
}

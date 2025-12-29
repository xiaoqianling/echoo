import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto } from '../schemas/auth.schemas';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'password'>;
  }> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);

    const tokens = await this.generateTokens(savedUser.id);
    const { password, ...userWithoutPassword } = savedUser;
    return { ...tokens, user: userWithoutPassword };
  }

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'password'>;
  }> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id);
    const { password, ...userWithoutPassword } = user;
    return { ...tokens, user: userWithoutPassword };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
      });

      const tokens = await this.generateTokens(payload.sub);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_SECRET || 'secretKey',
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400', 10),
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
        expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '604800', 10),
      },
    );

    return { accessToken, refreshToken };
  }
}

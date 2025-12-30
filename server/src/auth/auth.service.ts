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
      console.log('🔍 Refresh token verification attempt');
      console.log('- Token exists:', !!refreshToken);
      console.log('- Token length:', refreshToken ? refreshToken.length : 0);
      console.log(
        '- Token preview:',
        refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null',
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(refreshToken);
      console.log('✅ Refresh token verified successfully:', payload);

      const tokens = await this.generateTokens(payload.sub);
      return tokens;
    } catch (error) {
      console.log('❌ Refresh token verification failed:', error.message);
      console.log('- Error details:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    console.log('🔐 Generating tokens for user:', userId);

    const accessToken = this.jwtService.sign(
      { sub: userId },
      // {
      //   expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      // },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      // {
      //   secret: process.env.JWT_REFRESH_SECRET || 'echoo-refresh-secret-key',
      //   expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      // },
    );

    console.log('✅ Tokens generated successfully');
    console.log('- Access token length:', accessToken.length);
    console.log('- Refresh token length:', refreshToken.length);
    return { accessToken, refreshToken };
  }
}

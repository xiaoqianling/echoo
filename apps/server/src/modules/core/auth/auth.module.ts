import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ApiTokenStrategy } from './api-token.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ApiTokensModule } from '../api-tokens/api-tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'echoo-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    ApiTokensModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ApiTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}

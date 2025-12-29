import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterSchema, LoginSchema } from '../schemas/auth.schemas';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
import { z } from 'zod';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: unknown) {
    const validatedData = RegisterSchema.parse(body);
    return this.authService.register(validatedData);
  }

  @Post('login')
  login(@Body() body: unknown) {
    const validatedData = LoginSchema.parse(body);
    return this.authService.login(validatedData);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: AuthenticatedRequest) {
    const { password, ...userWithoutPassword } = req.user;
    return userWithoutPassword;
  }

  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}

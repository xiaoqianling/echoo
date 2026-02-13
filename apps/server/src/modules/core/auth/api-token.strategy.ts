import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ApiTokensService } from '../api-tokens/api-tokens.service';
import { Request } from 'express';

@Injectable()
export class ApiTokenStrategy extends PassportStrategy(Strategy, 'api-token') {
  constructor(private apiTokensService: ApiTokensService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    // Check if it looks like an API token (starts with echoo_sk_)
    if (!token.startsWith('echoo_sk_')) {
        // If it's not our token format, pass (so other strategies might handle it, or it fails)
        // Actually, for a multi-strategy guard, if one strategy fails, it might fail the whole request unless configured correctly.
        // But here we are explicitly checking.
        // Return null/false usually signals "pass" in some passport contexts, but in NestJS guards, it often means failure.
        // However, we only want to validate IF it looks like an API token.
        // If it's a JWT, this strategy should probably fail or ignore.
        throw new UnauthorizedException('Invalid token format');
    }

    const user = await this.apiTokensService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid API token');
    }

    return user;
  }
}

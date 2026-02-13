import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiToken } from './entities/api-token.entity';
import { User } from '@/modules/core/users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class ApiTokensService {
  constructor(
    @InjectRepository(ApiToken)
    private apiTokensRepository: Repository<ApiToken>,
  ) {}

  async create(user: User, name: string) {
    // Generate a random token
    const rawToken = 'echoo_sk_' + crypto.randomBytes(24).toString('hex');
    
    // Create hash (SHA-256)
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const prefix = rawToken.substring(0, 12) + '...';

    const apiToken = this.apiTokensRepository.create({
      name,
      tokenHash,
      prefix,
      user,
    });

    const savedToken = await this.apiTokensRepository.save(apiToken);

    // Return the entity + raw token (only once)
    return {
      ...savedToken,
      token: rawToken,
    };
  }

  async findAll(user: User) {
    return this.apiTokensRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(user: User, id: string) {
    const token = await this.apiTokensRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    
    if (token) {
      return this.apiTokensRepository.remove(token);
    }
    return null;
  }

  async validateToken(rawToken: string): Promise<User | null> {
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const token = await this.apiTokensRepository.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (token) {
      // Update usage stats asynchronously
      await this.apiTokensRepository.update(token.id, {
        usageCount: () => 'usageCount + 1',
        lastUsedAt: new Date(),
      });
      return token.user;
    }

    return null;
  }
}

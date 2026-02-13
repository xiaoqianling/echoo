import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../core/users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Message } from '../messages/entities/message.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Organization) private orgsRepo: Repository<Organization>,
    @InjectRepository(Message) private msgsRepo: Repository<Message>,
  ) {}

  async getStats() {
    return {
       userCount: await this.usersRepo.count(),
       orgCount: await this.orgsRepo.count(),
       messageCount: await this.msgsRepo.count(),
    };
  }
}

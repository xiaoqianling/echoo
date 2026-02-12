import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { User } from '../../core/users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Message } from '../messages/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, Message])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}

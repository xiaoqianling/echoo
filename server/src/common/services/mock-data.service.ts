import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { OrganizationMember } from '../../organizations/entities/organization-member.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MockDataService {
  async generateMockUser(): Promise<User> {
    const hashedPassword = await bcrypt.hash('password123', 10);
    return {
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      avatar: 'https://via.placeholder.com/150',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  generateMockMessage(user: User): Message {
    return {
      id: '1',
      title: 'Test Message',
      desp: 'This is a test message',
      short: 'Test message short description',
      tags: ['test', 'example'],
      sender: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  generateMockOrganization(user: User): Organization {
    return {
      id: '1',
      name: 'Test Organization',
      description: 'This is a test organization',
      owner: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  generateMockOrganizationMember(
    organization: Organization,
    user: User,
  ): OrganizationMember {
    return {
      id: '1',
      organization,
      user,
      role: 'member',
      joinedAt: new Date(),
    };
  }
}

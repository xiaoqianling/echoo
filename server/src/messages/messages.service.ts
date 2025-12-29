import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { WebSocketGateWay } from '../websocket/websocket.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    private readonly webSocketGateway: WebSocketGateWay,
  ) {}

  async sendMessage(
    user: User,
    sendMessageDto: SendMessageDto,
  ): Promise<Message> {
    let organization: Organization | undefined;
    if (sendMessageDto.organizationId) {
      const foundOrganization = await this.organizationsRepository.findOne({
        where: { id: sendMessageDto.organizationId },
      });
      if (!foundOrganization) {
        throw new Error('Organization not found');
      }
      organization = foundOrganization;
    }

    const message = this.messagesRepository.create({
      ...sendMessageDto,
      sender: user,
      organization,
    });

    const savedMessage = await this.messagesRepository.save(message);

    // 使用WebSocket发送消息通知
    await this.webSocketGateway.sendNewMessageNotification(savedMessage);

    return savedMessage;
  }

  async getMessages(user: User, organizationId?: string): Promise<Message[]> {
    if (organizationId) {
      return this.messagesRepository.find({
        where: { organization: { id: organizationId } },
        relations: ['sender', 'organization'],
        order: { createdAt: 'DESC' },
      });
    }

    return this.messagesRepository.find({
      where: { sender: { id: user.id } },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMessageById(id: string, user: User): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['sender', 'organization'],
    });

    if (!message) {
      throw new Error('Message not found');
    }

    // 检查权限：只有消息发送者或组织成员可以查看
    if (message.sender.id !== user.id) {
      if (message.organization) {
        // 这里需要添加组织成员检查逻辑
        // 目前简化处理：只有消息发送者可以查看
        throw new Error('Unauthorized');
      } else {
        throw new Error('Unauthorized');
      }
    }

    return message;
  }
}

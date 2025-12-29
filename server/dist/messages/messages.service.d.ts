import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { WebSocketGateWay } from '../websocket/websocket.gateway';
export declare class MessagesService {
    private messagesRepository;
    private usersRepository;
    private organizationsRepository;
    private readonly webSocketGateway;
    constructor(messagesRepository: Repository<Message>, usersRepository: Repository<User>, organizationsRepository: Repository<Organization>, webSocketGateway: WebSocketGateWay);
    sendMessage(user: User, sendMessageDto: SendMessageDto): Promise<Message>;
    getMessages(user: User, organizationId?: string): Promise<Message[]>;
    getMessageById(id: string, user: User): Promise<Message>;
}

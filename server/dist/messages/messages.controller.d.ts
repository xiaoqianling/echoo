import { MessagesService } from './messages.service';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    send(body: unknown, req: AuthenticatedRequest): Promise<import("./entities/message.entity").Message>;
    getMessages(req: AuthenticatedRequest, organizationId?: string): Promise<import("./entities/message.entity").Message[]>;
    getMessage(id: string, req: AuthenticatedRequest): Promise<import("./entities/message.entity").Message>;
}

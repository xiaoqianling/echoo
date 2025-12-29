import { MockDataService } from '../services/mock-data.service';
import { AuthService } from '../../auth/auth.service';
import { MessagesService } from '../../messages/messages.service';
import type { AuthenticatedRequest } from '../interfaces/request.interface';
export declare class TestController {
    private readonly mockDataService;
    private readonly authService;
    private readonly messagesService;
    constructor(mockDataService: MockDataService, authService: AuthService, messagesService: MessagesService);
    generateTestUser(): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("../../users/entities/user.entity").User;
    }>;
    sendTestMessage(body: unknown, req: AuthenticatedRequest): Promise<import("../../messages/entities/message.entity").Message>;
    getMockData(): Promise<{
        user: import("../../users/entities/user.entity").User;
        organization: import("../../organizations/entities/organization.entity").Organization;
        message: import("../../messages/entities/message.entity").Message;
        member: import("../../organizations/entities/organization-member.entity").OrganizationMember;
    }>;
}

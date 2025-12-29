import { User } from '../../users/entities/user.entity';
export type ClientType = 'web' | 'desktop' | 'mobile';
export declare class Client {
    id: string;
    user: User;
    type: ClientType;
    deviceInfo: Record<string, any>;
    lastOnline: Date;
    createdAt: Date;
}

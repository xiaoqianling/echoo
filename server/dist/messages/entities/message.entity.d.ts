import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
export declare class Message {
    id: string;
    title: string;
    desp?: string;
    short?: string;
    tags?: string[];
    sender: User;
    organization?: Organization;
    createdAt: Date;
    updatedAt: Date;
}

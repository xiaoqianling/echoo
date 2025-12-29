import { User } from '../../users/entities/user.entity';
import { Organization } from './organization.entity';
export type OrganizationMemberRole = 'owner' | 'admin' | 'member';
export declare class OrganizationMember {
    id: string;
    organization: Organization;
    user: User;
    role: OrganizationMemberRole;
    joinedAt: Date;
}

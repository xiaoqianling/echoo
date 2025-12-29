import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationMember, OrganizationMemberRole } from './entities/organization-member.entity';
import { User } from '../users/entities/user.entity';
export declare class OrganizationsService {
    private organizationsRepository;
    private organizationMembersRepository;
    private usersRepository;
    constructor(organizationsRepository: Repository<Organization>, organizationMembersRepository: Repository<OrganizationMember>, usersRepository: Repository<User>);
    createOrganization(user: User, name: string, description?: string): Promise<Organization>;
    getOrganizations(user: User): Promise<Organization[]>;
    getOrganizationById(id: string, user: User): Promise<Organization>;
    addMember(organizationId: string, userId: string, role: OrganizationMemberRole, currentUser: User): Promise<OrganizationMember>;
    removeMember(organizationId: string, userId: string, currentUser: User): Promise<void>;
}

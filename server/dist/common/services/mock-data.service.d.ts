import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { OrganizationMember } from '../../organizations/entities/organization-member.entity';
export declare class MockDataService {
    generateMockUser(): Promise<User>;
    generateMockMessage(user: User): Message;
    generateMockOrganization(user: User): Organization;
    generateMockOrganizationMember(organization: Organization, user: User): OrganizationMember;
}

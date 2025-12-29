import { OrganizationsService } from './organizations.service';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    create(body: unknown, req: AuthenticatedRequest): Promise<import("./entities/organization.entity").Organization>;
    getOrganizations(req: AuthenticatedRequest): Promise<import("./entities/organization.entity").Organization[]>;
    getOrganization(id: string, req: AuthenticatedRequest): Promise<import("./entities/organization.entity").Organization>;
    addMember(id: string, body: unknown, req: AuthenticatedRequest): Promise<import("./entities/organization-member.entity").OrganizationMember>;
    removeMember(id: string, userId: string, req: AuthenticatedRequest): Promise<void>;
}

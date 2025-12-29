"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_entity_1 = require("./entities/organization.entity");
const organization_member_entity_1 = require("./entities/organization-member.entity");
const user_entity_1 = require("../users/entities/user.entity");
let OrganizationsService = class OrganizationsService {
    organizationsRepository;
    organizationMembersRepository;
    usersRepository;
    constructor(organizationsRepository, organizationMembersRepository, usersRepository) {
        this.organizationsRepository = organizationsRepository;
        this.organizationMembersRepository = organizationMembersRepository;
        this.usersRepository = usersRepository;
    }
    async createOrganization(user, name, description) {
        const existingOrganization = await this.organizationsRepository.findOne({
            where: { name, owner: { id: user.id } },
        });
        if (existingOrganization) {
            throw new common_1.ConflictException('Organization with this name already exists');
        }
        const organization = this.organizationsRepository.create({
            name,
            description,
            owner: user,
        });
        const savedOrganization = await this.organizationsRepository.save(organization);
        const ownerMember = this.organizationMembersRepository.create({
            organization: savedOrganization,
            user,
            role: 'owner',
        });
        await this.organizationMembersRepository.save(ownerMember);
        return savedOrganization;
    }
    async getOrganizations(user) {
        const ownedOrganizations = await this.organizationsRepository.find({
            where: { owner: { id: user.id } },
        });
        const memberOrganizations = await this.organizationMembersRepository.find({
            where: { user: { id: user.id } },
            relations: ['organization'],
        });
        const joinedOrganizations = memberOrganizations.map((member) => member.organization);
        const allOrganizations = [...ownedOrganizations, ...joinedOrganizations];
        const uniqueOrganizations = Array.from(new Map(allOrganizations.map((org) => [org.id, org])).values());
        return uniqueOrganizations;
    }
    async getOrganizationById(id, user) {
        const organization = await this.organizationsRepository.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        const isMember = await this.organizationMembersRepository.findOne({
            where: { organization: { id }, user: { id: user.id } },
        });
        if (organization.owner.id !== user.id && !isMember) {
            throw new Error('Unauthorized');
        }
        return organization;
    }
    async addMember(organizationId, userId, role, currentUser) {
        const organization = await this.getOrganizationById(organizationId, currentUser);
        const currentMember = await this.organizationMembersRepository.findOne({
            where: {
                organization: { id: organizationId },
                user: { id: currentUser.id },
            },
        });
        if (organization.owner.id !== currentUser.id &&
            currentMember?.role !== 'admin') {
            throw new Error('Unauthorized to add members');
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingMember = await this.organizationMembersRepository.findOne({
            where: { organization: { id: organizationId }, user: { id: userId } },
        });
        if (existingMember) {
            throw new common_1.ConflictException('User is already a member of this organization');
        }
        const member = this.organizationMembersRepository.create({
            organization,
            user,
            role,
        });
        return await this.organizationMembersRepository.save(member);
    }
    async removeMember(organizationId, userId, currentUser) {
        const organization = await this.getOrganizationById(organizationId, currentUser);
        const currentMember = await this.organizationMembersRepository.findOne({
            where: {
                organization: { id: organizationId },
                user: { id: currentUser.id },
            },
        });
        if (organization.owner.id !== currentUser.id &&
            currentMember?.role !== 'admin') {
            throw new Error('Unauthorized to remove members');
        }
        if (organization.owner.id === userId) {
            throw new Error('Cannot remove organization owner');
        }
        const result = await this.organizationMembersRepository.delete({
            organization: { id: organizationId },
            user: { id: userId },
        });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Member not found');
        }
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(1, (0, typeorm_1.InjectRepository)(organization_member_entity_1.OrganizationMember)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import {
  OrganizationMember,
  OrganizationMemberRole,
} from './entities/organization-member.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private organizationMembersRepository: Repository<OrganizationMember>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createOrganization(
    user: User,
    name: string,
    description?: string,
  ): Promise<Organization> {
    // 检查用户是否已经有同名组织
    const existingOrganization = await this.organizationsRepository.findOne({
      where: { name, owner: { id: user.id } },
    });
    if (existingOrganization) {
      throw new ConflictException('Organization with this name already exists');
    }

    const organization = this.organizationsRepository.create({
      name,
      description,
      owner: user,
    });

    const savedOrganization =
      await this.organizationsRepository.save(organization);

    // 添加创建者为组织成员
    const ownerMember = this.organizationMembersRepository.create({
      organization: savedOrganization,
      user,
      role: 'owner',
    });
    await this.organizationMembersRepository.save(ownerMember);

    return savedOrganization;
  }

  async getOrganizations(user: User): Promise<Organization[]> {
    // 获取用户创建的组织
    const ownedOrganizations = await this.organizationsRepository.find({
      where: { owner: { id: user.id } },
    });

    // 获取用户加入的组织
    const memberOrganizations = await this.organizationMembersRepository.find({
      where: { user: { id: user.id } },
      relations: ['organization'],
    });

    const joinedOrganizations = memberOrganizations.map(
      (member) => member.organization,
    );

    // 合并并去重
    const allOrganizations = [...ownedOrganizations, ...joinedOrganizations];
    const uniqueOrganizations = Array.from(
      new Map(allOrganizations.map((org) => [org.id, org])).values(),
    );

    return uniqueOrganizations;
  }

  async getOrganizationById(id: string, user: User): Promise<Organization> {
    const organization = await this.organizationsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // 检查用户是否有权限访问该组织
    const isMember = await this.organizationMembersRepository.findOne({
      where: { organization: { id }, user: { id: user.id } },
    });

    if (organization.owner.id !== user.id && !isMember) {
      throw new Error('Unauthorized');
    }

    return organization;
  }

  async addMember(
    organizationId: string,
    userId: string,
    role: OrganizationMemberRole,
    currentUser: User,
  ): Promise<OrganizationMember> {
    const organization = await this.getOrganizationById(
      organizationId,
      currentUser,
    );

    // 检查当前用户是否有添加成员的权限
    const currentMember = await this.organizationMembersRepository.findOne({
      where: {
        organization: { id: organizationId },
        user: { id: currentUser.id },
      },
    });

    if (
      organization.owner.id !== currentUser.id &&
      currentMember?.role !== 'admin'
    ) {
      throw new Error('Unauthorized to add members');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 检查用户是否已经是组织成员
    const existingMember = await this.organizationMembersRepository.findOne({
      where: { organization: { id: organizationId }, user: { id: userId } },
    });

    if (existingMember) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    const member = this.organizationMembersRepository.create({
      organization,
      user,
      role,
    });

    return await this.organizationMembersRepository.save(member);
  }

  async removeMember(
    organizationId: string,
    userId: string,
    currentUser: User,
  ): Promise<void> {
    const organization = await this.getOrganizationById(
      organizationId,
      currentUser,
    );

    // 检查当前用户是否有移除成员的权限
    const currentMember = await this.organizationMembersRepository.findOne({
      where: {
        organization: { id: organizationId },
        user: { id: currentUser.id },
      },
    });

    if (
      organization.owner.id !== currentUser.id &&
      currentMember?.role !== 'admin'
    ) {
      throw new Error('Unauthorized to remove members');
    }

    // 不能移除组织拥有者
    if (organization.owner.id === userId) {
      throw new Error('Cannot remove organization owner');
    }

    const result = await this.organizationMembersRepository.delete({
      organization: { id: organizationId },
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Member not found');
    }
  }
}

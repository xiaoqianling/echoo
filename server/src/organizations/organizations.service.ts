import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import {
  OrganizationMember,
  OrganizationMemberRole,
} from './entities/organization-member.entity';
import { OrganizationMessage } from './entities/organization-message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private organizationMembersRepository: Repository<OrganizationMember>,
    @InjectRepository(OrganizationMessage)
    private organizationMessagesRepository: Repository<OrganizationMessage>,
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

  async getOrganizations(user: User): Promise<any[]> {
    // 获取用户创建的组织
    const ownedOrganizations = await this.organizationsRepository.find({
      where: { owner: { id: user.id } },
    });

    // 获取用户加入的组织
    const memberOrganizations = await this.organizationMembersRepository.find({
      where: { user: { id: user.id } },
      relations: ['organization'],
    });

    // 合并并去重
    const allOrganizations = [
      ...ownedOrganizations,
      ...memberOrganizations.map((member) => member.organization),
    ];
    const uniqueOrganizations = Array.from(
      new Map(allOrganizations.map((org) => [org.id, org])).values(),
    );

    // 增强组织数据，添加角色和成员数
    const enhancedOrganizations = await Promise.all(
      uniqueOrganizations.map(async (org) => {
        // 获取用户在该组织中的角色
        let role = 'member';
        if (org.owner?.id === user.id) {
          role = 'owner';
        } else {
          const member = await this.organizationMembersRepository.findOne({
            where: { organization: { id: org.id }, user: { id: user.id } },
          });
          if (member) {
            role = member.role;
          }
        }

        // 获取组织成员数
        const memberCount = await this.organizationMembersRepository.count({
          where: { organization: { id: org.id } },
        });

        return {
          ...org,
          role,
          memberCount,
        };
      }),
    );

    return enhancedOrganizations;
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
      throw new ForbiddenException('Unauthorized to remove members');
    }

    // 不能移除组织拥有者
    if (organization.owner.id === userId) {
      throw new ForbiddenException('Cannot remove organization owner');
    }

    // 检查目标用户是否为管理员（只有owner可以移除管理员）
    const targetMember = await this.organizationMembersRepository.findOne({
      where: {
        organization: { id: organizationId },
        user: { id: userId },
      },
    });

    if (
      targetMember?.role === 'admin' &&
      organization.owner.id !== currentUser.id
    ) {
      throw new ForbiddenException('Only owner can remove admins');
    }

    const result = await this.organizationMembersRepository.delete({
      organization: { id: organizationId },
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Member not found');
    }
  }

  // 发布组织消息
  async publishMessage(
    organizationId: string,
    title: string,
    content: string,
    currentUser: User,
  ): Promise<OrganizationMessage> {
    const organization = await this.getOrganizationById(
      organizationId,
      currentUser,
    );

    // 检查当前用户是否有发布消息的权限
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
      throw new ForbiddenException('Only owner or admin can publish messages');
    }

    const message = this.organizationMessagesRepository.create({
      title,
      content,
      organization,
      sender: currentUser,
    });

    return await this.organizationMessagesRepository.save(message);
  }

  // 获取组织消息列表
  async getOrganizationMessages(
    organizationId: string,
    currentUser: User,
  ): Promise<OrganizationMessage[]> {
    await this.getOrganizationById(organizationId, currentUser);

    return await this.organizationMessagesRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  // 任命管理员
  async promoteMember(
    organizationId: string,
    userId: string,
    currentUser: User,
  ): Promise<void> {
    const organization = await this.getOrganizationById(
      organizationId,
      currentUser,
    );

    // 只有owner可以任命管理员
    if (organization.owner.id !== currentUser.id) {
      throw new ForbiddenException('Only owner can promote members to admin');
    }

    const member = await this.organizationMembersRepository.findOne({
      where: {
        organization: { id: organizationId },
        user: { id: userId },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    member.role = 'admin';
    await this.organizationMembersRepository.save(member);
  }

  // 移除管理员权限
  async demoteAdmin(
    organizationId: string,
    userId: string,
    currentUser: User,
  ): Promise<void> {
    const organization = await this.getOrganizationById(
      organizationId,
      currentUser,
    );

    // 只有owner可以移除管理员权限
    if (organization.owner.id !== currentUser.id) {
      throw new ForbiddenException('Only owner can demote admins');
    }

    const member = await this.organizationMembersRepository.findOne({
      where: {
        organization: { id: organizationId },
        user: { id: userId },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    member.role = 'member';
    await this.organizationMembersRepository.save(member);
  }

  // 转移组织所有权
  async transferOwnership(
    organizationId: string,
    newOwnerId: string,
    currentUser: User,
  ): Promise<Organization> {
    const organization = await this.getOrganizationById(
      organizationId,
      currentUser,
    );

    // 只有当前owner可以转移所有权
    if (organization.owner.id !== currentUser.id) {
      throw new ForbiddenException('Only current owner can transfer ownership');
    }

    const newOwner = await this.usersRepository.findOne({
      where: { id: newOwnerId },
    });

    if (!newOwner) {
      throw new NotFoundException('New owner not found');
    }

    // 检查新owner是否为组织成员
    const newOwnerMember = await this.organizationMembersRepository.findOne({
      where: {
        organization: { id: organizationId },
        user: { id: newOwnerId },
      },
    });

    if (!newOwnerMember) {
      throw new ForbiddenException(
        'New owner must be a member of the organization',
      );
    }

    // 更新组织拥有者
    organization.owner = newOwner;
    await this.organizationsRepository.save(organization);

    // 更新原owner为admin角色
    const currentOwnerMember = await this.organizationMembersRepository.findOne(
      {
        where: {
          organization: { id: organizationId },
          user: { id: currentUser.id },
        },
      },
    );

    if (currentOwnerMember) {
      currentOwnerMember.role = 'admin';
      await this.organizationMembersRepository.save(currentOwnerMember);
    }

    return organization;
  }

  // 解散组织
  async deleteOrganization(
    organizationId: string,
    currentUser: User,
  ): Promise<void> {
    const organization = await this.getOrganizationById(
      organizationId,
      currentUser,
    );

    // 只有owner可以解散组织
    if (organization.owner.id !== currentUser.id) {
      throw new ForbiddenException('Only owner can delete organization');
    }

    // 删除组织消息
    await this.organizationMessagesRepository.delete({
      organization: { id: organizationId },
    });

    // 删除组织成员关系
    await this.organizationMembersRepository.delete({
      organization: { id: organizationId },
    });

    // 删除组织
    await this.organizationsRepository.delete(organizationId);
  }

  // 退出组织
  async leaveOrganization(
    organizationId: string,
    currentUser: User,
  ): Promise<void> {
    const organization = await this.getOrganizationById(
      organizationId,
      currentUser,
    );

    // 组织拥有者不能退出，只能解散
    if (organization.owner.id === currentUser.id) {
      throw new ForbiddenException(
        'Owner cannot leave organization, must delete it instead',
      );
    }

    const result = await this.organizationMembersRepository.delete({
      organization: { id: organizationId },
      user: { id: currentUser.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Member not found');
    }
  }

  // 获取组织成员列表
  async getMembers(organizationId: string, currentUser: User): Promise<any[]> {
    // 验证用户是否有权限访问该组织
    await this.getOrganizationById(organizationId, currentUser);

    // 获取组织成员
    const members = await this.organizationMembersRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['user'],
    });

    // 格式化成员数据
    return members.map((member) => ({
      id: member.user.id,
      name: member.user.name || member.user.email.split('@')[0],
      role: member.role,
      email: member.user.email,
      joinedAt: member.joinedAt,
    }));
  }
}

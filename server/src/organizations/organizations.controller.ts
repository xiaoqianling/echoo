import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
import {
  CreateOrganizationSchema,
  AddMemberSchema,
  PublishMessageSchema,
} from '../schemas/organization.schemas';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const validatedData = CreateOrganizationSchema.parse(body);
    return this.organizationsService.createOrganization(
      req.user,
      validatedData.name,
      validatedData.description,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getOrganizations(@Req() req: AuthenticatedRequest) {
    return this.organizationsService.getOrganizations(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getOrganization(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.organizationsService.getOrganizationById(id, req.user);
  }

  @Post(':id/members')
  @UseGuards(AuthGuard('jwt'))
  addMember(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    const validatedData = AddMemberSchema.parse(body);
    return this.organizationsService.addMember(
      id,
      validatedData.userId,
      validatedData.role,
      req.user,
    );
  }

  @Delete(':id/members/:userId')
  @UseGuards(AuthGuard('jwt'))
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.removeMember(id, userId, req.user);
  }

  // 发布组织消息
  @Post(':id/messages')
  @UseGuards(AuthGuard('jwt'))
  publishMessage(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    const validatedData = PublishMessageSchema.parse(body);
    return this.organizationsService.publishMessage(
      id,
      validatedData.content,
      req.user,
    );
  }

  // 获取组织消息列表
  @Get(':id/messages')
  @UseGuards(AuthGuard('jwt'))
  getOrganizationMessages(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.getOrganizationMessages(id, req.user);
  }

  // 任命管理员
  @Post(':id/members/:userId/promote')
  @UseGuards(AuthGuard('jwt'))
  promoteMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.promoteMember(id, userId, req.user);
  }

  // 移除管理员权限
  @Post(':id/members/:userId/demote')
  @UseGuards(AuthGuard('jwt'))
  demoteAdmin(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.demoteAdmin(id, userId, req.user);
  }

  // 转移组织所有权
  @Post(':id/transfer-ownership')
  @UseGuards(AuthGuard('jwt'))
  transferOwnership(
    @Param('id') id: string,
    @Body('newOwnerId') newOwnerId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.transferOwnership(
      id,
      newOwnerId,
      req.user,
    );
  }

  // 解散组织
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteOrganization(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.deleteOrganization(id, req.user);
  }

  // 退出组织
  @Post(':id/leave')
  @UseGuards(AuthGuard('jwt'))
  leaveOrganization(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.organizationsService.leaveOrganization(id, req.user);
  }
}

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
import type { AuthenticatedRequest } from '../../../shared/common/interfaces/request.interface';
import {
  CreateOrganizationSchema,
  AddMemberSchema,
  PublishMessageSchema,
} from '../../../shared/schemas/organization.schemas';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('组织 (Organizations)')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '创建组织' })
  @ApiResponse({ status: 201, description: '组织创建成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'My Organization' },
        description: { type: 'string', example: 'This is a description' },
      },
      required: ['name']
    }
  })
  create(@Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const validatedData = CreateOrganizationSchema.parse(body);
    return this.organizationsService.createOrganization(
      req.user,
      validatedData.name,
      validatedData.description,
    );
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取组织列表' })
  @ApiResponse({ status: 200, description: '返回当前用户相关的所有组织' })
  getOrganizations(@Req() req: AuthenticatedRequest) {
    return this.organizationsService.getOrganizations(req.user);
  }

  @Get(':id/detail')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取组织详情' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiResponse({ status: 200, description: '返回组织详情' })
  getOrganization(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.organizationsService.getOrganizationById(id, req.user);
  }

  @Post(':id/member/add')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '添加组织成员' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiResponse({ status: 201, description: '成员添加成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user-uuid' },
        role: { type: 'string', enum: ['admin', 'member'], example: 'member' },
      },
      required: ['userId', 'role']
    }
  })
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

  @Delete(':id/member/remove')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '移除组织成员' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user-uuid' },
      },
      required: ['userId']
    }
  })
  @ApiResponse({ status: 200, description: '成员移除成功' })
  removeMember(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.removeMember(id, userId, req.user);
  }

  // 发布组织消息
  @Post(':id/message/publish')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '发布组织消息' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiResponse({ status: 201, description: '消息发布成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Important Announcement' },
        content: { type: 'string', example: 'This is the content of the announcement.' },
      },
      required: ['title', 'content']
    }
  })
  publishMessage(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    const validatedData = PublishMessageSchema.parse(body);
    return this.organizationsService.publishMessage(
      id,
      validatedData.title,
      validatedData.content,
      req.user,
    );
  }

  // 获取组织消息列表
  @Get(':id/message/list')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取组织消息列表' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiResponse({ status: 200, description: '返回组织消息列表' })
  getOrganizationMessages(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.getOrganizationMessages(id, req.user);
  }

  // 任命管理员
  @Post(':id/member/promote')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '任命管理员' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user-uuid' },
      },
      required: ['userId']
    }
  })
  @ApiResponse({ status: 200, description: '成员已晋升为管理员' })
  promoteMember(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.promoteMember(id, userId, req.user);
  }

  // 移除管理员权限
  @Post(':id/member/demote')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '移除管理员权限' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user-uuid' },
      },
      required: ['userId']
    }
  })
  @ApiResponse({ status: 200, description: '管理员权限已移除' })
  demoteAdmin(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.demoteAdmin(id, userId, req.user);
  }

  // 转移组织所有权
  @Post(':id/owner/transfer')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '转移组织所有权' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newOwnerId: { type: 'string', example: 'new-owner-uuid' },
      },
      required: ['newOwnerId']
    }
  })
  @ApiResponse({ status: 200, description: '组织所有权转移成功' })
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
  @Delete(':id/delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '解散组织' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiResponse({ status: 200, description: '组织解散成功' })
  deleteOrganization(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.deleteOrganization(id, req.user);
  }

  // 退出组织
  @Post(':id/member/leave')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '退出组织' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiResponse({ status: 200, description: '已退出组织' })
  leaveOrganization(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.organizationsService.leaveOrganization(id, req.user);
  }

  // 获取组织成员列表
  @Get(':id/member/list')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取组织成员列表' })
  @ApiParam({ name: 'id', description: '组织 ID' })
  @ApiResponse({ status: 200, description: '返回成员列表' })
  getMembers(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.organizationsService.getMembers(id, req.user);
  }
}

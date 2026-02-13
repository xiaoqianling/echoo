import { Controller, Get, Req, UseGuards, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '@/shared/common/interfaces/request.interface';
import { UpdateUserSchema } from '@/shared/schemas/user.schemas';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('用户 (Users)')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '返回当前用户信息' })
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.findOneById(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: '更新当前用户信息' })
  @ApiResponse({ status: 200, description: '更新成功，返回更新后的用户信息' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
        settings: { type: 'object', example: { theme: 'dark', notifications: true } },
      },
    }
  })
  async updateMe(@Req() req: AuthenticatedRequest, @Body() body: unknown) {
    const validatedData = UpdateUserSchema.parse(body);
    return this.usersService.updateUser(req.user.id, validatedData);
  }
}

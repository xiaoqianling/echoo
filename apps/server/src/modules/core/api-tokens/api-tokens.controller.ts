import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTokensService } from './api-tokens.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '@/shared/common/interfaces/request.interface';

@ApiTags('API令牌 (API Tokens)')
@ApiBearerAuth()
@Controller('api-tokens')
@UseGuards(AuthGuard('jwt'))
export class ApiTokensController {
  constructor(private readonly apiTokensService: ApiTokensService) {}

  @Post()
  @ApiOperation({ summary: '创建 API Token' })
  @ApiBody({ schema: { type: 'object', properties: { name: { type: 'string' } } } })
  create(@Req() req: AuthenticatedRequest, @Body('name') name: string) {
    return this.apiTokensService.create(req.user, name || 'Untitled Token');
  }

  @Get()
  @ApiOperation({ summary: '获取所有 API Token' })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.apiTokensService.findAll(req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除 API Token' })
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.apiTokensService.remove(req.user, id);
  }
}

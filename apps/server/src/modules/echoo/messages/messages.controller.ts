import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageSchema } from '@/shared/schemas/message.schemas';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '@/shared/common/interfaces/request.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('消息 (Messages)')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // 发送消息
  @Post('send')
  @UseGuards(AuthGuard(['jwt', 'api-token']))
  @ApiOperation({ summary: '发送消息' })
  @ApiResponse({ status: 201, description: '消息发送成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Hello World' },
        desp: { type: 'string', example: 'This is a test message' },
        short: { type: 'string', example: 'Test message' },
        tags: {
          type: 'array',
          items: { type: 'string' },
          example: ['test', 'hello'],
        },
        organizationId: { type: 'string', example: 'uuid-string' },
      },
      required: ['title'],
    },
  })
  send(@Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const validatedData = SendMessageSchema.parse(body);
    return this.messagesService.sendMessage(req.user, validatedData);
  }

  // 获取消息列表
  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取消息列表' })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    description: '组织 ID，若提供则返回该组织的消息',
  })
  @ApiResponse({ status: 200, description: '返回消息列表' })
  getMessages(
    @Req() req: AuthenticatedRequest,
    @Query('organizationId') organizationId?: string,
  ) {
    return this.messagesService.getMessages(req.user, organizationId);
  }

  // 获取消息详情
  @Get(':id/detail')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取消息详情' })
  @ApiParam({ name: 'id', description: '消息 ID' })
  @ApiResponse({ status: 200, description: '返回消息详情' })
  getMessage(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.messagesService.getMessageById(id, req.user);
  }
}

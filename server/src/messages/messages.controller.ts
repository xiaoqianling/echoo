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
import { SendMessageSchema } from '../schemas/message.schemas';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
import { z } from 'zod';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // 发送消息
  @Post('send')
  @UseGuards(AuthGuard('jwt'))
  send(@Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const validatedData = SendMessageSchema.parse(body);
    return this.messagesService.sendMessage(req.user, validatedData);
  }

  // 获取消息列表
  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  getMessages(
    @Req() req: AuthenticatedRequest,
    @Query('organizationId') organizationId?: string,
  ) {
    return this.messagesService.getMessages(req.user, organizationId);
  }

  // 获取消息详情
  @Get(':id/detail')
  @UseGuards(AuthGuard('jwt'))
  getMessage(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.messagesService.getMessageById(id, req.user);
  }
}

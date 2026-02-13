import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MockDataService } from '../services/mock-data.service';
import { AuthService } from '@/modules/core/auth/auth.service';
import { MessagesService } from '@/modules/echoo/messages/messages.service';
import type { AuthenticatedRequest } from '../interfaces/request.interface';
import { SendMessageSchema } from '../../schemas/message.schemas';

@Controller('test')
export class TestController {
  constructor(
    private readonly mockDataService: MockDataService,
    private readonly authService: AuthService,
    private readonly messagesService: MessagesService,
  ) {}

  // 生成测试用户并返回访问令牌
  @Post('generate-test-user')
  async generateTestUser() {
    const mockUser = await this.mockDataService.generateMockUser();
    const tokens = await this.authService.generateTokens(mockUser.id);
    return {
      user: mockUser,
      ...tokens,
    };
  }

  // 测试消息发送
  @Post('send-test-message')
  @UseGuards(AuthGuard('jwt'))
  async sendTestMessage(
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    const validatedData = SendMessageSchema.parse(body);
    const message = await this.messagesService.sendMessage(
      req.user,
      validatedData,
    );
    return message;
  }

  // 获取测试数据
  @Get('mock-data')
  async getMockData() {
    const user = await this.mockDataService.generateMockUser();
    const organization = this.mockDataService.generateMockOrganization(user);
    const message = this.mockDataService.generateMockMessage(user);
    const member = this.mockDataService.generateMockOrganizationMember(
      organization,
      user,
    );

    return {
      user,
      organization,
      message,
      member,
    };
  }
}

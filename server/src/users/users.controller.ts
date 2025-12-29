import { Controller, Get, Req, UseGuards, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
import { UpdateUserSchema } from '../schemas/user.schemas';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.findOneById(req.user.id);
  }

  @Put('me')
  async updateMe(@Req() req: AuthenticatedRequest, @Body() body: unknown) {
    const validatedData = UpdateUserSchema.parse(body);
    return this.usersService.updateUser(req.user.id, validatedData);
  }
}

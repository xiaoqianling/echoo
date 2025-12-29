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
}

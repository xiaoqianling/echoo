import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('Echoo Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get public statistics' })
  @ApiResponse({ status: 200, description: 'Return public stats' })
  async getStats() {
    return this.statsService.getStats();
  }
}

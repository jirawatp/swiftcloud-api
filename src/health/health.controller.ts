import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import dayjs from 'dayjs';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Health check endpoint' })
  @Get()
  checkHealth() {
    return { status: 'ok', timestamp: dayjs().toISOString() };
  }
}
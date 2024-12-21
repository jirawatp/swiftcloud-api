import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PopularService } from './popular.service';
import { PopularDto } from '../common/dto/popular.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('popular')
@ApiBearerAuth()
@Controller('popular')
export class PopularController {
  constructor(private readonly popularService: PopularService) {}

  @ApiOperation({ summary: 'Get most popular songs by month/year' })
  @Get()
  async getPopular(@Query() query: PopularDto) {
    const { year, month } = query;
    return this.popularService.getMostPopular(year, month);
  }
}
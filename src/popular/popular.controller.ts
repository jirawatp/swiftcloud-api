import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { PopularService } from './popular.service';
import { PopularByMonthDto } from '../common/dto/popular-by-month.dto';
import { PopularityType } from '../common/enums/popularity-type.enum';
import { ApiTags, ApiOperation, ApiSecurity, ApiQuery } from '@nestjs/swagger';

@ApiTags('popular')
@ApiSecurity('api-key')
@Controller('popular')
export class PopularController {
  constructor(private readonly popularService: PopularService) {}

  @ApiOperation({ summary: 'Get popular songs or albums for a specific month and year' })
  @Get('by-month')
  @ApiQuery({ 
    name: 'year', 
    required: true, 
    type: Number, 
    description: 'Year of the songs' 
  })
  @ApiQuery({ 
    name: 'month', 
    required: true, 
    type: Number, 
    description: 'Month of the songs (1-12)' 
  })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    enum: PopularityType, 
    description: 'Type of popularity query: song or album' 
  })
  async getPopularByMonth(@Query() query: PopularByMonthDto) {
    return this.popularService.getPopularByMonth(query.year, query.month, query.type);
  }

  @ApiOperation({ summary: 'Get popular songs or albums overall, across all months' })
  @Get('overall')
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    enum: ['song', 'album'], 
    description: 'Type of popularity query: song or album' 
  })
  async getPopularOverall(@Query('type') type?: PopularityType) {
    return this.popularService.getPopularOverall(type || PopularityType.SONG);
  }
}
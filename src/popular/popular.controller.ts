import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { PopularService } from './popular.service';
import { PopularByMonthDto } from '../common/dto/popular-by-month.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PopularityType } from 'src/common/enums/popularity-type.enum';

@ApiTags('popular')
@ApiSecurity('api-key')
@Controller('popular')
export class PopularController {
  constructor(private readonly popularService: PopularService) {}

  @ApiOperation({ summary: 'Get most popular songs or albums by month' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items to return', example: 10 })
  @ApiQuery({ name: 'offset', required: false, description: 'Number of items to skip', example: 0 })
  @Get()
  async getPopularByMonth(
    @Query() query: PopularByMonthDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.popularService.getPopularByMonth(
      query.year,
      query.month,
      query.type,
      pagination.limit,
      pagination.offset,
    );
  }

  @ApiOperation({ summary: 'Get most popular songs or albums overall' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items to return', example: 10 })
  @ApiQuery({ name: 'offset', required: false, description: 'Number of items to skip', example: 0 })
  @Get('overall')
  async getPopularOverall(
    @Query('type') type: PopularityType,
    @Query() pagination: PaginationDto,
  ) {
    return this.popularService.getPopularOverall(
      type,
      pagination.limit,
      pagination.offset,
    );
  }
}
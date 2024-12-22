import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchDto } from '../common/dto/search.dto';
import { SearchService } from './search.service';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('search')
@ApiSecurity('api-key')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: 'Search songs or albums by query' })
  @Get()
  async search(
    @Query() query: SearchDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.searchService.search(query.query, pagination.limit, pagination.offset);
  }
}
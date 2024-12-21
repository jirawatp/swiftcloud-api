import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchDto } from '../common/dto/search.dto';
import { SearchService } from './search.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('search')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: 'Search songs or albums by query' })
  @Get()
  async search(@Query() query: SearchDto) {
    return this.searchService.searchSongsOrAlbums(query.query);
  }
}
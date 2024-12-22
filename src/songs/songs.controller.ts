import { Controller, Get, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { YearDto } from '../common/dto/year.dto';
import { SortDto } from '../common/dto/sort.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiSecurity } from '@nestjs/swagger';

@ApiTags('songs')
@ApiSecurity('api-key')
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @ApiOperation({ summary: 'Get songs by year or sorted' })
  @Get()
  @ApiQuery({
    name: 'field',
    required: false,
    enum: ['year', 'playsJune', 'playsJuly', 'playsAugust', 'title', 'artist', 'album'],
  })
  async getSongs(
    @Query('field') field: string,
    @Query() pagination: PaginationDto,
  ) {
    if (field) {
      return this.songsService.getSongsSorted(field, pagination.limit, pagination.offset);
    } else {
      return this.songsService.getAllSongs(pagination.limit, pagination.offset);
    }
  }
}
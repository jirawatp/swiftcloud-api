import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { YearDto } from '../common/dto/year.dto';
import { SortDto } from '../common/dto/sort.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('songs')
@ApiBearerAuth()
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @ApiOperation({ summary: 'Get songs by year or sorted' })
  @Get()
  async getSongs(@Query() query: YearDto & SortDto) {
    if (query.year) {
      return this.songsService.getSongsByYear(query.year);
    }
    if (query.sort) {
      return this.songsService.getSongsSorted(query.sort);
    }
    return this.songsService.getSongsSorted('releaseDate');
  }
}
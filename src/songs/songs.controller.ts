import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { YearDto } from '../common/dto/year.dto';
import { SortDto } from '../common/dto/sort.dto';
import { ApiTags, ApiOperation, ApiSecurity, ApiQuery } from '@nestjs/swagger';

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
    description: 'Field to sort the songs by',
  })
  @ApiQuery({ 
    name: 'order', 
    required: false, 
    enum: ['asc', 'desc'],
    description: 'Sort order: asc for ascending, desc for descending',
  })
  async getSongs(
    @Query('field') field: string,
    @Query('order') order: string = 'asc', // Default to 'asc' if not provided
  ) {
    // Validate 'order' parameter
    if (order && !['asc', 'desc'].includes(order.toLowerCase())) {
      throw new BadRequestException(`Invalid order parameter: ${order}. Allowed values are 'asc' or 'desc'.`);
    }
    if (field) {
      return this.songsService.getSongsSorted(field, order.toLowerCase());
    } else {
      // Handle the case where no field is provided, e.g., return unsorted songs or use a default sort
      return this.songsService.getAllSongs(); // Assuming you have a method to get all songs without sorting
    }
  }
}
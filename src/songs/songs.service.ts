import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DataLoaderService, SongRecord } from '../data-loader/data-loader.service';
import { safeSortField } from '../common/utils/transform.utils';
import { ALLOWED_SORT_FIELDS } from '../common/constants';

@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(
    private readonly dataLoaderService: DataLoaderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getSongsByYear(year: number): Promise<SongRecord[]> {
    const cacheKey = `songs_year_${year}`;
    let songs = await this.cacheManager.get<SongRecord[]>(cacheKey);
    if (!songs) {
      const allSongs = this.dataLoaderService.getSongs();
      songs = allSongs.filter(song => song.year === year);
      await this.cacheManager.set(cacheKey, songs, 120);
    }
    return songs || [];
  }
  async getSongsSorted(field: string, order: string = 'asc'): Promise<SongRecord[]> {
    const allowedFields = ['year', 'playsJune', 'playsJuly', 'playsAugust', 'title', 'artist', 'album'];
    if (!allowedFields.includes(field)) {
      this.logger.warn(`Attempted to sort by invalid field: ${field}`);
      throw new BadRequestException(`Invalid sort field: ${field}. Allowed fields are: ${allowedFields.join(', ')}`);
    }

    if (!['asc', 'desc'].includes(order)) {
      this.logger.warn(`Attempted to sort with invalid order: ${order}`);
      throw new BadRequestException(`Invalid sort order: ${order}. Allowed values are 'asc' or 'desc'.`);
    }

    const cacheKey = `songs_sorted_${field}_${order}`;
    let songs = await this.cacheManager.get<SongRecord[]>(cacheKey);
    if (!songs) {
      this.logger.log(`Cache miss for key: ${cacheKey}`);
      const allSongs = this.dataLoaderService.getSongs();
      songs = [...allSongs].sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
      });
      this.logger.debug(`Number of songs after sorting by ${field} (${order}): ${songs.length}`);
      await this.cacheManager.set(cacheKey, songs, 120);
      this.logger.log(`Cached sorted songs by ${field} (${order})`);
    } else {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      this.logger.debug(`Number of songs retrieved from cache: ${songs.length}`);
    }
    return songs || [];
  }

  async getAllSongs(): Promise<SongRecord[]> {
    const cacheKey = `songs_all`;
    let songs = await this.cacheManager.get<SongRecord[]>(cacheKey);
    if (!songs) {
      this.logger.log(`Cache miss for key: ${cacheKey}`);
      songs = this.dataLoaderService.getSongs();
      await this.cacheManager.set(cacheKey, songs, 120);
      this.logger.log(`Cached all songs`);
    } else {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
    }
    return songs;
  }
}
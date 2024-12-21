import { Injectable, Inject, Logger } from '@nestjs/common';
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
      songs = allSongs.filter(s => s.year === year);
      await this.cacheManager.set(cacheKey, songs, 120);
    }
    return songs || [];
  }
  async getSongsSorted(field: string): Promise<SongRecord[]> {
    const allowedFields = ['year', 'playsJune', 'playsJuly', 'playsAugust', 'title', 'artist', 'album'];
    if (!allowedFields.includes(field)) {
      this.logger.warn(`Attempted to sort by invalid field: ${field}`);
      throw new Error(`Invalid sort field`);
    }

    const cacheKey = `songs_sorted_${field}`;
    let songs = await this.cacheManager.get<SongRecord[]>(cacheKey);
    if (!songs) {
      this.logger.log(`Cache miss for key: ${cacheKey}`);
      const allSongs = this.dataLoaderService.getSongs();
      songs = [...allSongs].sort((a, b) => {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
      });
      await this.cacheManager.set(cacheKey, songs, 120);
      this.logger.log(`Cached sorted songs by ${field}`);
    } else {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
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
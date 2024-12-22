import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DataLoaderService, SongRecord } from '../data-loader/data-loader.service';

@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(
    private readonly dataLoaderService: DataLoaderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllSongs(limit: number = 10, offset: number = 0): Promise<SongRecord[]> {
    const cacheKey = `all_songs_limit_${limit}_offset_${offset}`;
    let songs = await this.cacheManager.get<SongRecord[]>(cacheKey);

    if (!songs) {
      this.logger.log(`Cache miss for key: ${cacheKey}`);
      const allSongs = this.dataLoaderService.getSongs();
      songs = allSongs.slice(offset, offset + limit);
      await this.cacheManager.set(cacheKey, songs, 300);
    } else {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
    }

    return songs;
  }

  async getSongsSorted(
    field: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<SongRecord[]> {
    const validFields = ['year', 'playsJune', 'playsJuly', 'playsAugust', 'title', 'artist', 'album'];
    if (!validFields.includes(field)) {
      throw new BadRequestException(`Invalid sort field: ${field}`);
    }

    const cacheKey = `songs_sorted_${field}_limit_${limit}_offset_${offset}`;
    let songs = await this.cacheManager.get<SongRecord[]>(cacheKey);

    if (!songs) {
      this.logger.log(`Cache miss for key: ${cacheKey}`);
      const allSongs = this.dataLoaderService.getSongs();
      songs = allSongs
        .sort((a, b) => (a[field] > b[field] ? 1 : -1))
        .slice(offset, offset + limit);
      await this.cacheManager.set(cacheKey, songs, 300);
    } else {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
    }

    return songs;
  }
}
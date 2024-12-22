import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DataLoaderService, SongRecord } from '../data-loader/data-loader.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly dataLoaderService: DataLoaderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async search(query: string, limit: number = 10, offset: number = 0): Promise<SongRecord[]> {
    const cacheKey = `search_${query}_limit_${limit}_offset_${offset}`;
    let results = await this.cacheManager.get<SongRecord[]>(cacheKey);

    if (!results) {
      this.logger.log(`Cache miss for key: ${cacheKey}`);
      const allSongs = this.dataLoaderService.getSongs();
      results = allSongs
        .filter(
          (song) =>
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase()) ||
            song.album.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(offset, offset + limit);
      await this.cacheManager.set(cacheKey, results, 300);
    } else {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
    }

    return results;
  }
}
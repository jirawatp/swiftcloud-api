import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DataLoaderService, SongRecord } from '../data-loader/data-loader.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly dataLoaderService: DataLoaderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async searchSongsOrAlbums(q: string): Promise<SongRecord[]> {
    const cacheKey = `search_${q}`;
    let results = await this.cacheManager.get<SongRecord[]>(cacheKey);
    if (!results) {
      const allSongs = this.dataLoaderService.getSongs();
      const lowerQ = q.toLowerCase();
      results = allSongs.filter(s =>
        s.title.toLowerCase().includes(lowerQ) ||
        s.artist.toLowerCase().includes(lowerQ) ||
        s.album.toLowerCase().includes(lowerQ) ||
        s.writer.toLowerCase().includes(lowerQ)
      );
      await this.cacheManager.set(cacheKey, results, 60);
    }
    return results;
  }
}
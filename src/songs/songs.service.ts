import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DataLoaderService, SongRecord } from '../data-loader/data-loader.service';
import { safeSortField } from '../common/utils/transform.utils';
import { ALLOWED_SORT_FIELDS } from '../common/constants';

@Injectable()
export class SongsService {
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
    const safeField = safeSortField(field, ['year', 'playsJune', 'playsJuly', 'playsAugust', 'title', 'artist', 'album']);
    const cacheKey = `songs_sorted_${safeField}`;
    let songs = await this.cacheManager.get<SongRecord[]>(cacheKey);
    if (!songs) {
      const allSongs = this.dataLoaderService.getSongs();
      songs = [...allSongs].sort((a, b) => {
        if (a[safeField] < b[safeField]) return -1;
        if (a[safeField] > b[safeField]) return 1;
        return 0;
      });
      await this.cacheManager.set(cacheKey, songs, 120);
    }
    return songs || [];
  }
}
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Song } from '../entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { safeSortField } from '../common/utils/transform.utils';
import { ALLOWED_SORT_FIELDS } from '../common/constants';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getSongsByYear(year: number): Promise<Song[]> {
    const cacheKey = `songs_year_${year}`;
    let songs = await this.cacheManager.get<Song[]>(cacheKey);
    if (!songs) {
      songs = await this.songsRepository.find({ where: { year } });
      await this.cacheManager.set(cacheKey, songs, 120);
    }
    return songs;
  }

  async getSongsSorted(field: string): Promise<Song[]> {
    const safeField = safeSortField(field, ALLOWED_SORT_FIELDS);
    const cacheKey = `songs_sorted_${safeField}`;
    let songs = await this.cacheManager.get<Song[]>(cacheKey);
    if (!songs) {
      songs = await this.songsRepository.find({ order: { [safeField]: 'ASC' } });
      await this.cacheManager.set(cacheKey, songs, 120);
    }
    return songs;
  }
}
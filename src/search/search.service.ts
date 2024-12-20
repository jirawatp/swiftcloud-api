import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from '../entities/song.entity';
import { Like, Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async searchSongsOrAlbums(q: string): Promise<Song[]> {
    const cacheKey = `search_${q}`;
    let results = await this.cacheManager.get<Song[]>(cacheKey);
    if (!results) {
      results = await this.songsRepository.find({
        where: [
          { title: Like(`%${q}%`) },
          { album: Like(`%${q}%`) },
        ],
        take: 50,
      });
      await this.cacheManager.set(cacheKey, results, 60);
    }
    return results;
  }
}
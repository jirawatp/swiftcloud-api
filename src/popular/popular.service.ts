import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DataLoaderService, SongRecord } from '../data-loader/data-loader.service';
import { PopularityType } from '../common/enums/popularity-type.enum';

@Injectable()
export class PopularService {
  private readonly logger = new Logger(PopularService.name);

  constructor(
    private readonly dataLoaderService: DataLoaderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getPopularByMonth(
    year: number,
    month: number,
    type: PopularityType = PopularityType.SONG,
    limit: number = 10,
    offset: number = 0,
  ): Promise<any[]> {
    const cacheKey = `popular_${type}_year_${year}_month_${month}_limit_${limit}_offset_${offset}`;
    let popularItems = await this.cacheManager.get<any[]>(cacheKey);

    if (!popularItems) {
      this.logger.log(`Cache miss for key: ${cacheKey}`);
      const allSongs = this.dataLoaderService.getSongs();

      const filteredSongs = allSongs.filter((song) => song.year === year);
      const monthFields = [
        'playsJanuary',
        'playsFebruary',
        'playsMarch',
        'playsApril',
        'playsMay',
        'playsJune',
        'playsJuly',
        'playsAugust',
        'playsSeptember',
        'playsOctober',
        'playsNovember',
        'playsDecember',
      ];
      const monthField = monthFields[month - 1];
      if (!monthField) {
        throw new BadRequestException(`Invalid month: ${month}.`);
      }

      const sortedItems =
        type === PopularityType.SONG
          ? this.getPopularSongsByMonth(filteredSongs, monthField)
          : this.getPopularAlbumsByMonth(filteredSongs, monthField);

      popularItems = sortedItems.slice(offset, offset + limit);

      await this.cacheManager.set(cacheKey, popularItems, 300);
    } else {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
    }

    return popularItems || [];
  }

  async getPopularOverall(
    type: PopularityType = PopularityType.SONG,
    limit: number = 10,
    offset: number = 0,
  ): Promise<any[]> {
    const cacheKey = `popular_${type}_overall_limit_${limit}_offset_${offset}`;
    let popularItems = await this.cacheManager.get<any[]>(cacheKey);

    if (!popularItems) {
      this.logger.log(`Cache miss for key: ${cacheKey}`);
      const allSongs = this.dataLoaderService.getSongs();

      if (allSongs.length === 0) {
        throw new BadRequestException(`No songs data available.`);
      }

      if (type === PopularityType.SONG) {
        const songPlays = allSongs.map((song) => {
          const totalPlays = Object.keys(song)
            .filter((key) => key.startsWith('plays'))
            .reduce((sum, key) => sum + (song[key as keyof SongRecord] || 0), 0);
          return {
            title: song.title,
            artist: song.artist,
            album: song.album,
            totalPlays,
          };
        });

        popularItems = songPlays
          .sort((a, b) => b.totalPlays - a.totalPlays)
          .slice(offset, offset + limit);
      } else if (type === PopularityType.ALBUM) {
        const albumPlaysMap: { [album: string]: number } = {};
        allSongs.forEach((song) => {
          if (!albumPlaysMap[song.album]) {
            albumPlaysMap[song.album] = 0;
          }
          const songTotalPlays = Object.keys(song)
            .filter((key) => key.startsWith('plays'))
            .reduce((sum, key) => sum + (song[key as keyof SongRecord] || 0), 0);
          albumPlaysMap[song.album] += songTotalPlays;
        });

        popularItems = Object.entries(albumPlaysMap)
          .map(([album, plays]) => ({ album, totalPlays: plays }))
          .sort((a, b) => b.totalPlays - a.totalPlays)
          .slice(offset, offset + limit);
      }

      await this.cacheManager.set(cacheKey, popularItems, 600);
    } else {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
    }

    return popularItems || [];
  }

  private getPopularSongsByMonth(
    songs: SongRecord[],
    monthField: string,
  ): any[] {
    return songs
      .filter((song) => song[monthField] && song[monthField] > 0)
      .sort((a, b) => (b[monthField] as number) - (a[monthField] as number))
      .map((song) => ({
        title: song.title,
        artist: song.artist,
        album: song.album,
        plays: song[monthField],
      }));
  }

  private getPopularAlbumsByMonth(
    songs: SongRecord[],
    monthField: string,
  ): any[] {
    const albumPlaysMap: { [album: string]: number } = {};
    songs.forEach((song) => {
      if (!albumPlaysMap[song.album]) {
        albumPlaysMap[song.album] = 0;
      }
      albumPlaysMap[song.album] += song[monthField] || 0;
    });

    return Object.entries(albumPlaysMap)
      .map(([album, plays]) => ({ album, plays }))
      .sort((a, b) => b.plays - a.plays);
  }
}
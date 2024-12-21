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

  /**
   * Get popular songs or albums for a specific month and year.
   * @param year The year to filter songs/albums.
   * @param month The month to filter songs/albums.
   * @param type The type of item to retrieve ('song' or 'album').
   */
  async getPopularByMonth(
    year: number,
    month: number,
    type: PopularityType = PopularityType.SONG,
  ): Promise<any[]> {
    const cacheKey = `popular_${type}_year_${year}_month_${month}`;
    let popularItems = await this.cacheManager.get<any[]>(cacheKey);

    if (!popularItems) {
      this.logger.log(`Cache miss for key: ${cacheKey}`);
      const allSongs = this.dataLoaderService.getSongs();

      // Filter songs by year
      const filteredSongs = allSongs.filter((song) => song.year === year);
      if (filteredSongs.length === 0) {
        throw new BadRequestException(
          `No songs found for year ${year}.`,
        );
      }

      // Determine the play count field based on the month number
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

      // Sort songs/albums based on plays in the specified month
      let sortedItems: any[] = [];
      if (type === PopularityType.SONG) {
        sortedItems = filteredSongs
          .filter((song) => song[monthField] !== undefined)
          .sort((a, b) => b[monthField] - a[monthField])
          .map((song) => ({
            title: song.title,
            artist: song.artist,
            album: song.album,
            plays: song[monthField],
          }));
      } else if (type === PopularityType.ALBUM) {
        // Aggregate plays per album
        const albumPlaysMap: { [album: string]: number } = {};
        filteredSongs.forEach((song) => {
          if (!albumPlaysMap[song.album]) {
            albumPlaysMap[song.album] = 0;
          }
          albumPlaysMap[song.album] += song[monthField] || 0;
        });
        sortedItems = Object.entries(albumPlaysMap)
          .map(([album, plays]) => ({ album, plays }))
          .sort((a, b) => b.plays - a.plays);
      }

      // Select top 10 items
      popularItems = sortedItems.slice(0, 10);

      // Cache the result
      await this.cacheManager.set(cacheKey, popularItems, 300);
      this.logger.log(
        `Cached popular ${type}s for year ${year}, month ${month}`,
      );
    } else {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
    }

    return popularItems || [];
  }

  /**
   * Get popular songs or albums overall, across all months.
   * @param type The type of item to retrieve ('song' or 'album').
   */
  async getPopularOverall(
    type: PopularityType = PopularityType.SONG,
  ): Promise<any[]> {
    const cacheKey = `popular_${type}_overall`;
    let popularItems = await this.cacheManager.get<any[]>(cacheKey);

    if (!popularItems) {
      this.logger.log(`Cache miss for key: ${cacheKey}`);
      const allSongs = this.dataLoaderService.getSongs();

      if (allSongs.length === 0) {
        throw new BadRequestException(`No songs data available.`);
      }

      if (type === PopularityType.SONG) {
        // Aggregate total plays per song across all months
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

        // Sort songs by total plays
        popularItems = songPlays
          .sort((a, b) => b.totalPlays - a.totalPlays)
          .slice(0, 10);
      } else if (type === PopularityType.ALBUM) {
        // Aggregate total plays per album across all songs and months
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

        // Convert map to array and sort by total plays
        popularItems = Object.entries(albumPlaysMap)
          .map(([album, plays]) => ({ album, totalPlays: plays }))
          .sort((a, b) => b.totalPlays - a.totalPlays)
          .slice(0, 10);
      }

      // Cache the result
      await this.cacheManager.set(cacheKey, popularItems, 600);
      this.logger.log(`Cached overall popular ${type}s`);
    } else {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
    }

    return popularItems || [];
  }
}
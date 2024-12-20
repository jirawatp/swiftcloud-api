import { Injectable } from '@nestjs/common';
import { DataLoaderService, SongRecord } from '../data-loader/data-loader.service';
import dayjs from 'dayjs';

@Injectable()
export class PopularService {
  constructor(private readonly dataLoaderService: DataLoaderService) {}

  async getMostPopular(year: number, month: number): Promise<SongRecord[]> {
    // Adjust code to interpret month as a number
    const monthToField: { [key: number]: string } = {
      6: 'playsJune',
      7: 'playsJuly',
      8: 'playsAugust',
    };
    const field = monthToField[month] || 'playsJune';
    const allSongs = this.dataLoaderService.getSongs();
    const filtered = allSongs.filter(song => song.year === year);
    return [...filtered].sort((a, b) => b[field] - a[field]).slice(0, 10);
  }
}
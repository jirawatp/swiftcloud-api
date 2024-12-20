import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { Song } from '../entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';

@Injectable()
export class PopularService {
  constructor(
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
  ) {}

  async getMostPopular(year: number, month: number): Promise<Song[]> {
    const start = dayjs(`${year}-${month}-01`).startOf('month').toDate();
    const end = dayjs(`${year}-${month}-01`).endOf('month').toDate();

    return this.songsRepository.find({
      where: {
        releaseDate: Between(start, end),
      },
      order: { playCount: 'DESC' },
      take: 10,
    });
  }
}
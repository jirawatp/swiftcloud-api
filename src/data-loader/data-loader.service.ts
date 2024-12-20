import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../entities/song.entity';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class DataLoaderService {
  private readonly logger = new Logger(DataLoaderService.name);
  private readonly dataUrl = process.env.DATA_SHEET_URL || 'https://example.com/songs.csv';

  constructor(
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
  ) {}

  async loadDataFromSource(): Promise<void> {
    this.logger.log(`Fetching data from ${this.dataUrl}`);
    const response = await axios.get(this.dataUrl, { responseType: 'arraybuffer' });
    const csvBuffer = Buffer.from(response.data);

    const songs: Partial<Song>[] = [];
    await new Promise<void>((resolve, reject) => {
      Readable.from(csvBuffer)
        .pipe(csvParser.default())
        .on('data', (row: any) => {
          songs.push({
            title: row.title,
            year: parseInt(row.year, 10),
            releaseDate: row.releaseDate ? new Date(row.releaseDate) : undefined,
            playCount: parseInt(row.playCount, 10) || 0,
            album: row.album,
            writer: row.writer,
          });
        })
        .on('end', () => resolve())
        .on('error', (err: unknown) => reject(err));
    });

    this.logger.log(`Parsed ${songs.length} songs from CSV.`);

    for (const s of songs) {
      await this.songsRepository.upsert(s, ['title', 'year']);
    }

    this.logger.log(`Successfully upserted ${songs.length} songs into the database.`);
  }
}
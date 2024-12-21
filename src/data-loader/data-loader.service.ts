import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

export interface SongRecord {
  title: string;
  artist: string;
  writer: string;
  album: string;
  year: number;
  playsJanuary?: number;
  playsFebruary?: number;
  playsMarch?: number;
  playsApril?: number;
  playsMay?: number;
  playsJune?: number;
  playsJuly?: number;
  playsAugust?: number;
  playsSeptember?: number;
  playsOctober?: number;
  playsNovember?: number;
  playsDecember?: number;
  [key: string]: any; // To allow dynamic indexing by field name
}

@Injectable()
export class DataLoaderService {
  private readonly logger = new Logger(DataLoaderService.name);
  private readonly dataPath = path.join(__dirname, 'songs.csv'); // Ensure songs.csv is placed in src/data/
  private songs: SongRecord[] = [];

  async loadData(): Promise<void> {
    this.logger.log(`Loading data from ${this.dataPath}`);
    const results: SongRecord[] = [];

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(this.dataPath)
        .pipe(csvParser())
        .on('data', (row: any) => {
          const song: SongRecord = {
            title: row['Song'] || '',
            artist: row['Artist'] || '',
            writer: row['Writer'] || '',
            album: row['Album'] || '',
            year: row['Year'] ? parseInt(row['Year'], 10) : NaN,
            playsJanuary: row['Plays - January'] ? parseInt(row['Plays - January'], 10) : 0,
            playsFebruary: row['Plays - February'] ? parseInt(row['Plays - February'], 10) : 0,
            playsMarch: row['Plays - March'] ? parseInt(row['Plays - March'], 10) : 0,
            playsApril: row['Plays - April'] ? parseInt(row['Plays - April'], 10) : 0,
            playsMay: row['Plays - May'] ? parseInt(row['Plays - May'], 10) : 0,
            playsJune: row['Plays - June'] ? parseInt(row['Plays - June'], 10) : 0,
            playsJuly: row['Plays - July'] ? parseInt(row['Plays - July'], 10) : 0,
            playsAugust: row['Plays - August'] ? parseInt(row['Plays - August'], 10) : 0,
            playsSeptember: row['Plays - September'] ? parseInt(row['Plays - September'], 10) : 0,
            playsOctober: row['Plays - October'] ? parseInt(row['Plays - October'], 10) : 0,
            playsNovember: row['Plays - November'] ? parseInt(row['Plays - November'], 10) : 0,
            playsDecember: row['Plays - December'] ? parseInt(row['Plays - December'], 10) : 0,
          };
          results.push(song);
          this.logger.debug(`Loaded song: ${JSON.stringify(song)}`);
        })
        .on('end', () => {
          this.songs = results;
          this.logger.log(`Loaded ${results.length} songs.`);
          resolve();
        })
        .on('error', (err: unknown) => {
          this.logger.error('Error loading songs data:', err);
          reject(err);
        });
    });
  }

  getSongs(): SongRecord[] {
    this.logger.log(`Returning ${this.songs.length} songs`);
    return this.songs;
  }
}
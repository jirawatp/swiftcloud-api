import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

export interface SongRecord {
  title: string;
  artist: string;
  writer: string;   // The Writer field may contain multiple lines or multiple writers
  album: string;
  year: number;
  playsJune: number;
  playsJuly: number;
  playsAugust: number;
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
          results.push({
            title: row['Song'] || '',
            artist: row['Artist'] || '',
            writer: row['Writer'] || '',
            album: row['Album'] || '',
            year: row['Year'] ? parseInt(row['Year'], 10) : NaN,
            playsJune: row['Plays - June'] ? parseInt(row['Plays - June'], 10) : 0,
            playsJuly: row['Plays - July'] ? parseInt(row['Plays - July'], 10) : 0,
            playsAugust: row['Plays - August'] ? parseInt(row['Plays - August'], 10) : 0,
          });
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
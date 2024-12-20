import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from '../src/songs/songs.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DataLoaderService, SongRecord } from '../src/data-loader/data-loader.service';

describe('SongsService', () => {
  let service: SongsService;
  let dataLoaderService: Partial<DataLoaderService>;

  beforeEach(async () => {
    // Mock data that matches new CSV columns
    const mockSongs: SongRecord[] = [
      {
        title: 'The 1',
        artist: 'Taylor Swift',
        writer: 'Taylor Swift\nAaron Dessner',
        album: 'Folklore',
        year: 2020,
        playsJune: 68,
        playsJuly: 6,
        playsAugust: 61
      },
      {
        title: '22',
        artist: 'Taylor Swift',
        writer: 'Taylor Swift\nMax Martin\nShellback',
        album: 'Red',
        year: 2012,
        playsJune: 27,
        playsJuly: 30,
        playsAugust: 32
      },
    ];

    dataLoaderService = {
      getSongs: jest.fn().mockReturnValue(mockSongs),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        { provide: DataLoaderService, useValue: dataLoaderService },
        { provide: CACHE_MANAGER, useValue: { get: jest.fn(), set: jest.fn() } },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
  });

  it('should return songs by year', async () => {
    const songs = await service.getSongsByYear(2020);
    expect(songs).toEqual([
      {
        title: 'The 1',
        artist: 'Taylor Swift',
        writer: 'Taylor Swift\nAaron Dessner',
        album: 'Folklore',
        year: 2020,
        playsJune: 68,
        playsJuly: 6,
        playsAugust: 61
      }
    ]);
  });
});
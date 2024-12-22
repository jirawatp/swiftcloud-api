import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from '../src/songs/songs.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { DataLoaderService, SongRecord } from '../src/data-loader/data-loader.service';

describe('SongsService', () => {
  let service: SongsService;
  let dataLoaderService: DataLoaderService;
  let cacheManager: Cache;

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
        year: 2024,
        playsJune: 27,
        playsJuly: 30,
        playsAugust: 32
      },
    ];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: DataLoaderService,
          useValue: {
            getSongs: jest.fn().mockReturnValue(mockSongs),
          },
        },
        { provide: CACHE_MANAGER, useValue: { get: jest.fn(), set: jest.fn() } },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    dataLoaderService = module.get<DataLoaderService>(DataLoaderService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should return paginated songs from cache', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue([
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

    const result = await service.getAllSongs(1, 0);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('The 1');
  });

  it('should fetch paginated songs and cache the result', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(cacheManager, 'set').mockResolvedValue(Promise.resolve());

    const result = await service.getAllSongs(1, 0);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('The 1');
  });

  it('should return sorted songs from cache', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue([
      {
        title: '22',
        artist: 'Taylor Swift',
        writer: 'Taylor Swift\nMax Martin\nShellback',
        album: 'Red',
        year: 2024,
        playsJune: 27,
        playsJuly: 30,
        playsAugust: 32
      }
    ]);

    const result = await service.getSongsSorted('year', 1, 0);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('22');
  });

  it('should fetch sorted songs and cache the result', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(cacheManager, 'set').mockResolvedValue();

    const result = await service.getSongsSorted('year', 1, 0);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('The 1');
  });
});
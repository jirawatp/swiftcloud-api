import { Test, TestingModule } from '@nestjs/testing';
import { PopularService } from '../src/popular/popular.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DataLoaderService, SongRecord } from '../src/data-loader/data-loader.service';
import dayjs from 'dayjs';

describe('PopularService', () => {
  let service: PopularService;
  let dataLoaderService: Partial<DataLoaderService>;

  beforeEach(async () => {
    // Mock data set aligned with new fields
    const mockSongs: SongRecord[] = [
      {
        title: 'The 1',
        artist: 'Taylor Swift',
        writer: 'Taylor Swift\nAaron Dessner',
        album: 'Folklore',
        year: 2020,
        playsJune: 68,
        playsJuly: 6,
        playsAugust: 61,
      },
      {
        title: '22',
        artist: 'Taylor Swift',
        writer: 'Taylor Swift\nMax Martin\nShellback',
        album: 'Red',
        year: 2012,
        playsJune: 27,
        playsJuly: 30,
        playsAugust: 32,
      },
      {
        title: 'Afterglow',
        artist: 'Taylor Swift',
        writer: 'Taylor Swift\nLouis Bell\nFrank Dukes',
        album: 'Lover',
        year: 2019,
        playsJune: 90,
        playsJuly: 17,
        playsAugust: 87,
      },
    ];

    dataLoaderService = {
      getSongs: jest.fn().mockReturnValue(mockSongs),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PopularService,
        { provide: DataLoaderService, useValue: dataLoaderService },
        { provide: CACHE_MANAGER, useValue: { get: jest.fn(), set: jest.fn() } },
      ],
    }).compile();

    service = module.get<PopularService>(PopularService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getMostPopular should filter by year and sort songs by the chosen month', async () => {
    // Test July (7)
    // Only songs with year matching the requested year are considered.
    // Let's use year=2012 and month=7:
    const result2012 = await service.getMostPopular(2012, 7);
    // Year 2012: only "22" matches (playsJuly=30)
    expect(result2012).toEqual([
      {
        title: '22',
        artist: 'Taylor Swift',
        writer: 'Taylor Swift\nMax Martin\nShellback',
        album: 'Red',
        year: 2012,
        playsJune: 27,
        playsJuly: 30,
        playsAugust: 32,
      },
    ]);

    // Test year=2020, month=7 (July):
    // Year 2020: only "The 1" matches (playsJuly=6)
    const result2020 = await service.getMostPopular(2020, 7);
    expect(result2020).toEqual([
      {
        title: 'The 1',
        artist: 'Taylor Swift',
        writer: 'Taylor Swift\nAaron Dessner',
        album: 'Folklore',
        year: 2020,
        playsJune: 68,
        playsJuly: 6,
        playsAugust: 61,
      },
    ]);

    // Test year=2019, month=7:
    // Year 2019: only "Afterglow" matches (playsJuly=17)
    const result2019 = await service.getMostPopular(2019, 7);
    expect(result2019).toEqual([
      {
        title: 'Afterglow',
        artist: 'Taylor Swift',
        writer: 'Taylor Swift\nLouis Bell\nFrank Dukes',
        album: 'Lover',
        year: 2019,
        playsJune: 90,
        playsJuly: 17,
        playsAugust: 87,
      },
    ]);
  });
});
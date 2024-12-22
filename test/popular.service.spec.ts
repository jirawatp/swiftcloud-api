import { Test, TestingModule } from '@nestjs/testing';
import { PopularService } from '../src/popular/popular.service';
import { DataLoaderService } from '../src/data-loader/data-loader.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PopularityType } from '../src/common/enums/popularity-type.enum';

describe('PopularService', () => {
  let service: PopularService;
  let dataLoaderService: DataLoaderService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PopularService,
        {
          provide: DataLoaderService,
          useValue: {
            getSongs: jest.fn().mockReturnValue([
              { title: 'Song A', artist: 'Taylor Swift', year: 2021, playsJune: 100 },
              { title: 'Song B', artist: 'Taylor Swift', year: 2021, playsJuly: 50 },
            ]),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PopularService>(PopularService);
    dataLoaderService = module.get<DataLoaderService>(DataLoaderService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should return popular songs by month from cache', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue([
      { title: 'Song A', artist: 'Taylor Swift', plays: 100 },
    ]);

    const result = await service.getPopularByMonth(2021, 6, PopularityType.SONG);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Song A');
  });

  it('should fetch and cache popular songs by month', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(cacheManager, 'set').mockResolvedValue();

    const result = await service.getPopularByMonth(2021, 6, PopularityType.SONG);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Song A');
  });

  it('should return overall popular songs', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue([
      { title: 'Song B', artist: 'Taylor Swift', totalPlays: 500 },
    ]);

    const result = await service.getPopularOverall(PopularityType.SONG);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Song B');
  });
});
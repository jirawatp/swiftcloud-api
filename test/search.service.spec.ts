import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from '../src/search/search.service';
import { DataLoaderService } from '../src/data-loader/data-loader.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('SearchService', () => {
  let service: SearchService;
  let dataLoaderService: DataLoaderService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: DataLoaderService,
          useValue: {
            getSongs: jest.fn().mockReturnValue([
              { title: 'Song A', artist: 'Taylor Swift', album: 'Folklore' },
              { title: 'Song B', artist: 'Taylor Swift', album: 'Red' },
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

    service = module.get<SearchService>(SearchService);
    dataLoaderService = module.get<DataLoaderService>(DataLoaderService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should return cached search results', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue([
      { title: 'Song A', artist: 'Taylor Swift', album: 'Folklore' },
    ]);

    const result = await service.search('Taylor', 1, 0);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Song A');
  });

  it('should fetch search results and cache the result', async () => {
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(cacheManager, 'set').mockResolvedValue();

    const result = await service.search('Taylor', 1, 0);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Song A');
  });
});
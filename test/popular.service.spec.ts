import { Test, TestingModule } from '@nestjs/testing';
import { PopularService } from '../src/popular/popular.service';
import { DataLoaderService } from '../src/data-loader/data-loader.service';
import { PopularityType } from '../src/common/enums/popularity-type.enum';
import { YearDto } from '../src/common/dto/year.dto';

describe('PopularService', () => {
  let popularService: PopularService;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PopularService,
        {
          provide: DataLoaderService,
          useValue: {
            getSongs: jest.fn().mockReturnValue([
              { title: 'Song A', artist: 'artistA', playsJune: 100, album: 'Album 1', year: 2021, month: 6 },
              { title: 'Song B', artist: 'artistA', playsJune: 200, album: 'Album 2', year: 2021, month: 6 },
            ]),
          },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    popularService = module.get<PopularService>(PopularService);
  });

  it('should return most popular songs for a month', async () => {
    const result = await popularService.getPopularByMonth(2021, 6, PopularityType.SONG);
    expect(result).toEqual([
      { title: 'Song B', artist: 'artistA', album: 'Album 2', plays: 200 },
      { title: 'Song A', artist: 'artistA', album: 'Album 1', plays: 100 },
    ]);
  });

  it('should return most popular albums for a month', async () => {
    const result = await popularService.getPopularByMonth(2021, 6, PopularityType.ALBUM);
    expect(result).toEqual([
      { album: 'Album 2', plays: 200 },
      { album: 'Album 1', plays: 100 },
    ]);
  });
});
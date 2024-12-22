import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from '../src/search/search.controller';
import { SearchService } from '../src/search/search.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: {
            search: jest.fn(),
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

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  it('should return paginated search results', async () => {
    jest.spyOn(service, 'search').mockResolvedValue([
      { title: 'Song A', artist: 'Taylor Swift', album: 'Folklore', writer: 'Aaron Dessner', year: 2020 },
    ]);

    const result = await controller.search({ query: 'Taylor' }, { limit: 10, offset: 0 });
    expect(result).toEqual([{ title: 'Song A', artist: 'Taylor Swift', album: 'Folklore', writer: 'Aaron Dessner', year: 2020 }]);
  });
});
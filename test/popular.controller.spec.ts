import { Test, TestingModule } from '@nestjs/testing';
import { PopularController } from '../src/popular/popular.controller';
import { PopularService } from '../src/popular/popular.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PopularityType } from '../src/common/enums/popularity-type.enum';

describe('PopularController', () => {
  let controller: PopularController;
  let service: PopularService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PopularController],
      providers: [
        {
          provide: PopularService,
          useValue: {
            getPopularByMonth: jest.fn(),
            getPopularOverall: jest.fn(),
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

    controller = module.get<PopularController>(PopularController);
    service = module.get<PopularService>(PopularService);
  });

  it('should return popular songs by month', async () => {
    jest.spyOn(service, 'getPopularByMonth').mockResolvedValue([
      { title: 'Song A', artist: 'Taylor Swift', plays: 100 },
    ]);

    const result = await controller.getPopularByMonth(
      { year: 2021, month: 6, type: PopularityType.SONG },
      { limit: 10, offset: 0 },
    );
    expect(result).toEqual([{ title: 'Song A', artist: 'Taylor Swift', plays: 100 }]);
    expect(service.getPopularByMonth).toHaveBeenCalledWith(2021, 6, PopularityType.SONG, 10, 0);
  });

  it('should return popular albums by month', async () => {
    jest.spyOn(service, 'getPopularByMonth').mockResolvedValue([
      { album: 'Folklore', plays: 150 },
    ]);

    const result = await controller.getPopularByMonth(
      { year: 2021, month: 6, type: PopularityType.ALBUM },
      { limit: 10, offset: 0 },
    );
    expect(result).toEqual([{ album: 'Folklore', plays: 150 }]);
    expect(service.getPopularByMonth).toHaveBeenCalledWith(2021, 6, PopularityType.ALBUM, 10, 0);
  });

  it('should return overall popular songs', async () => {
    jest.spyOn(service, 'getPopularOverall').mockResolvedValue([
      { title: 'Song B', artist: 'Taylor Swift', totalPlays: 500 },
    ]);

    const result = await controller.getPopularOverall(
      PopularityType.SONG,
      { limit: 10, offset: 0 },
    );
    expect(result).toEqual([{ title: 'Song B', artist: 'Taylor Swift', totalPlays: 500 }]);
    expect(service.getPopularOverall).toHaveBeenCalledWith(PopularityType.SONG, 10, 0);
  });

  it('should return overall popular albums', async () => {
    jest.spyOn(service, 'getPopularOverall').mockResolvedValue([
      { album: 'Evermore', totalPlays: 300 },
    ]);

    const result = await controller.getPopularOverall(
      PopularityType.ALBUM,
      { limit: 10, offset: 0 },
    );
    expect(result).toEqual([{ album: 'Evermore', totalPlays: 300 }]);
    expect(service.getPopularOverall).toHaveBeenCalledWith(PopularityType.ALBUM, 10, 0);
  });

  it('should handle invalid month error', async () => {
    jest.spyOn(service, 'getPopularByMonth').mockRejectedValue(new Error('Invalid month: 13'));

    await expect(
      controller.getPopularByMonth({ year: 2021, month: 13, type: PopularityType.SONG }, { limit: 10, offset: 0 }),
    ).rejects.toThrow('Invalid month: 13');
    expect(service.getPopularByMonth).toHaveBeenCalledWith(2021, 13, PopularityType.SONG, 10, 0);
  });
});
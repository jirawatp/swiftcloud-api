import { Test, TestingModule } from '@nestjs/testing';
import { PopularController } from '../src/popular/popular.controller';
import { PopularService } from '../src/popular/popular.service';
import { PopularByMonthDto } from '../src/common/dto/popular-by-month.dto';
import { PopularityType } from '../src/common/enums/popularity-type.enum';

describe('PopularController', () => {
  let controller: PopularController;
  let service: PopularService;

  const mockPopularService = {
    getPopularByMonth: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PopularController],
      providers: [
        {
          provide: PopularService,
          useValue: mockPopularService,
        },
      ],
    }).compile();

    controller = module.get<PopularController>(PopularController);
    service = module.get<PopularService>(PopularService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPopularByMonth', () => {
    it('should return popular songs by month', async () => {
      const dto: PopularByMonthDto = { year: 2021, month: 7, type: PopularityType.SONG };
      const expectedResult = [
        { title: 'Song B', artist: 'Artist 2', album: 'Album Beta', plays: 300 },
        { title: 'Song A', artist: 'Artist 1', album: 'Album Alpha', plays: 150 },
      ];

      mockPopularService.getPopularByMonth.mockResolvedValue(expectedResult);

      const result = await controller.getPopularByMonth(dto);
      expect(result).toEqual(expectedResult);
      expect(service.getPopularByMonth).toHaveBeenCalledWith(2021, 7, PopularityType.SONG);
    });
  });
});
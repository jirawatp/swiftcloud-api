import { Test, TestingModule } from '@nestjs/testing';
import { PopularService } from '../src/popular/popular.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from '../src/entities/song.entity';
import { Repository } from 'typeorm';

describe('PopularService', () => {
  let service: PopularService;
  let repo: Repository<Song>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PopularService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PopularService>(PopularService);
    repo = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getMostPopular should call find', async () => {
    await service.getMostPopular(2021, 7);
    expect(repo.find).toHaveBeenCalled();
  });
});
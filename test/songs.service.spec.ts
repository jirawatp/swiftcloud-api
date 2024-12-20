import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from '../src/songs/songs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from '../src/entities/song.entity';
import { Repository } from 'typeorm';

describe('SongsService', () => {
  let service: SongsService;
  let repo: Repository<Song>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    repo = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getSongsByYear should call repository find', async () => {
    await service.getSongsByYear(2020);
    expect(repo.find).toHaveBeenCalledWith({ where: { year: 2020 } });
  });
});
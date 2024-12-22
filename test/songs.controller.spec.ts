import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from '../src/songs/songs.controller';
import { SongsService } from '../src/songs/songs.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: {
            getAllSongs: jest.fn(),
            getSongsSorted: jest.fn(),
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

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('should return paginated songs', async () => {
    jest.spyOn(service, 'getAllSongs').mockResolvedValue([
      {
        title: 'Song A', artist: 'Artist A', year: 2021,
        writer: '',
        album: ''
      },
    ]);

    const result = await controller.getSongs('', { limit: 10, offset: 0 });
    expect(result).toEqual([{
      title: 'Song A',
      artist: 'Artist A',
      year: 2021,
      writer: '',
      album: '',
    }]);
  });

  it('should return sorted songs', async () => {
    jest.spyOn(service, 'getSongsSorted').mockResolvedValue([
      {
        title: 'Song B', artist: 'Artist B', year: 2021,
        writer: '',
        album: ''
      },
    ]);

    const result = await controller.getSongs('year', { limit: 10, offset: 0 });
    expect(result).toEqual([{
      title: 'Song B',
      artist: 'Artist B',
      year: 2021,
      writer: '',
      album: '',
    }]);
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from '../src/songs/songs.service';
import { SongsController } from '../src/songs/songs.controller';
import { SongRecord } from '../src/data-loader/data-loader.service';

describe('SongsController', () => {
  let songsController: SongsController;
  let songsService: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: {
            getSongsSorted: jest.fn(),
            getAllSongs: jest.fn(),
          },
        },
      ],
    }).compile();

    songsController = module.get<SongsController>(SongsController);
    songsService = module.get<SongsService>(SongsService);
  });

  it('should return sorted songs', async () => {
    const mockSongs: SongRecord[] = [
      {
        title: 'Song A',
        artist: 'Artist A',
        writer: 'Writer A',
        album: 'Album A',
        year: 2020,
      },
      {
        title: 'Song B',
        artist: 'Artist B',
        writer: 'Writer B',
        album: 'Album B',
        year: 2021,
      },
    ];
    jest.spyOn(songsService, 'getSongsSorted').mockResolvedValue(mockSongs);

    const result = await songsController.getSongs('title');
    expect(result).toEqual(mockSongs);
    expect(songsService.getSongsSorted).toHaveBeenCalledWith('title', 'asc');
  });

  it('should return all songs if no field is provided', async () => {
    const mockSongs: SongRecord[] = [
      {
        title: 'Song A',
        artist: 'Artist A',
        writer: 'Writer A',
        album: 'Album A',
        year: 2020,
      },
      {
        title: 'Song B',
        artist: 'Artist B',
        writer: 'Writer B',
        album: 'Album B',
        year: 2021,
      },
    ];
    jest.spyOn(songsService, 'getAllSongs').mockResolvedValue(mockSongs);

    const result = await songsController.getSongs('');
    expect(result).toEqual(mockSongs);
    expect(songsService.getAllSongs).toHaveBeenCalled();
  });
});
import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { DataLoaderModule } from 'src/data-loader/data-loader.module';

@Module({
  imports: [DataLoaderModule],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService],
})
export class SongsModule {}
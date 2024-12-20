import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PopularController } from './popular.controller';
import { PopularService } from './popular.service';
import { Song } from '../entities/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [PopularController],
  providers: [PopularService],
})
export class PopularModule {}
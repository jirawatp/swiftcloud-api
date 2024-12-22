import { Module } from '@nestjs/common';
import { PopularController } from './popular.controller';
import { PopularService } from './popular.service';
import { DataLoaderModule } from 'src/data-loader/data-loader.module';

@Module({
  imports: [DataLoaderModule],
  controllers: [PopularController],
  providers: [PopularService],
})
export class PopularModule {}
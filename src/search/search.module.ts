import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { DataLoaderModule } from 'src/data-loader/data-loader.module';

@Module({
  imports: [DataLoaderModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { DataModule } from 'src/data-loader/data.module';

@Module({
  imports: [DataModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
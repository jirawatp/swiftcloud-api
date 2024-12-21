import { Module, OnModuleInit } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthModule } from './health/health.module';
import { SongsModule } from './songs/songs.module';
import { PopularModule } from './popular/popular.module';
import { SearchModule } from './search/search.module';
import { DataLoaderService } from './data-loader/data-loader.service';

@Module({
  imports: [
    HealthModule,
    SongsModule,
    PopularModule,
    SearchModule,
    CacheModule.register({
      ttl: 60,
      max: 100,
    }),
  ],
  providers: [DataLoaderService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataLoaderService: DataLoaderService) {}

  async onModuleInit() {
    await this.dataLoaderService.loadData();
  }
}
import { Module, OnModuleInit } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthModule } from './health/health.module';
import { SongsModule } from './songs/songs.module';
import { PopularModule } from './popular/popular.module';
import { SearchModule } from './search/search.module';
import { DataLoaderService } from './data-loader/data-loader.service';
import { WinstonModule } from 'nest-winston';
import { getWinstonConfig } from './config/logger';

@Module({
  imports: [
    WinstonModule.forRoot(getWinstonConfig()),
    HealthModule,
    SongsModule,
    PopularModule,
    SearchModule,
    CacheModule.register({
      isGlobal: true,
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
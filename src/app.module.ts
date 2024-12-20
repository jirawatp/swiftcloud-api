import { Module, OnModuleInit } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './config/ormconfig';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { SongsModule } from './songs/songs.module';
import { PopularModule } from './popular/popular.module';
import { SearchModule } from './search/search.module';
import { DataLoaderService } from './data-loader/data-loader.service';
import { Song } from './entities/song.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    HealthModule,
    SongsModule,
    PopularModule,
    SearchModule,
    TypeOrmModule.forFeature([Song]),
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
    await this.dataLoaderService.loadDataFromSource();
  }
}
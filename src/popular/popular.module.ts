import { Module } from '@nestjs/common';
import { PopularController } from './popular.controller';
import { PopularService } from './popular.service';
import { DataModule } from 'src/data-loader/data.module';

@Module({
  imports: [DataModule],
  controllers: [PopularController],
  providers: [PopularService],
})
export class PopularModule {}
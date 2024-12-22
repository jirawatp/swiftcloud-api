import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SortDto {
  @ApiPropertyOptional({ description: 'Sort field', enum: ['playCount', 'releaseDate'] })
  @IsOptional()
  @IsString()
  sort?: string;
}
import { IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class YearDto {
  @ApiPropertyOptional({ example: 2020 })
  @IsOptional()
  @IsInt()
  year?: number;
}
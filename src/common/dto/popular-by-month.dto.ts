import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PopularityType } from '../enums/popularity-type.enum';

export class PopularByMonthDto {
  @ApiProperty({
    description: 'Year of the songs',
    example: 2019,
  })
  @IsInt({ message: 'Year must be an integer.' })
  @Min(1900, { message: 'Year must be at least 1900.' })
  @Max(new Date().getFullYear(), { message: 'Year cannot be in the future.' })
  @Type(() => Number)
  year!: number;

  @ApiProperty({
    description: 'Month of the songs (1-12)',
    example: 7,
  })
  @IsInt({ message: 'Month must be an integer.' })
  @Min(1, { message: 'Month must be between 1 and 12.' })
  @Max(12, { message: 'Month must be between 1 and 12.' })
  @Type(() => Number)
  month!: number;

  @ApiProperty({
    description: 'Type of popularity query',
    example: 'song', // or 'album'
    required: false,
    enum: ['song', 'album'],
  })
  @IsOptional()
  type?: PopularityType;
}
import { IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Number of items to return (default: 10)',
    example: 10,
  })
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer.' })
  @Min(1, { message: 'Limit must be at least 1.' })
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Number of items to skip (default: 0)',
    example: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Offset must be an integer.' })
  @Min(0, { message: 'Offset must be at least 0.' })
  @Type(() => Number)
  offset?: number = 0;
}
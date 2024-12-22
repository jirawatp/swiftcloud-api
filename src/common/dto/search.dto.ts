import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty({ example: 'Love' })
  @IsString()
  query!: string;
}
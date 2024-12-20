import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PopularDto {
  @ApiProperty({ example: 2021 })
  @IsInt()
  year!: number;

  @ApiProperty({ example: 7 })
  @IsInt()
  month!: number;
}
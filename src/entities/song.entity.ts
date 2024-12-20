import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('songs')
export class Song {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ nullable: false })
  title!: string;

  @ApiProperty()
  @Index()
  @Column({ nullable: true })
  year!: number;

  @ApiProperty()
  @Index()
  @Column({ type: 'date', nullable: true })
  releaseDate!: Date;

  @ApiProperty()
  @Index()
  @Column({ type: 'int', default: 0 })
  playCount!: number;

  @ApiProperty()
  @Column({ nullable: true })
  album!: string;

  @ApiProperty()
  @Column({ nullable: true })
  writer!: string;
}
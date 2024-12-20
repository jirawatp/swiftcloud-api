import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Song } from '../entities/song.entity';

export const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Song],
  synchronize: false,
  logging: false,
};
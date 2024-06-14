import { DataSource, DataSourceOptions } from 'typeorm';

const config = {
  type: 'postgres',
  url: `${process.env.DB_URL}`,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

// noinspection JSUnusedGlobalSymbols
export const connectionSource = new DataSource(config as DataSourceOptions);

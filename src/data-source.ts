import { DataSource } from 'typeorm';
import { Quote } from './quote/entity/quote.entity';
import { ContributeQuote } from './quote/entity/contribute-quote.entity';
import { Lecturer } from './lecturer/entity/lecturer.entity';
import { ContributeLecturer } from './lecturer/entity/contribute-lecturer.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'data.db',
  entities: [Quote, ContributeQuote, Lecturer, ContributeLecturer],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false,
});

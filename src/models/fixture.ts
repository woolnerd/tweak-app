import Base from './base';
import { fixtures } from '@/db/schema';
import { db } from '@/db/client';
import { InsertFixture, SelectFixture } from '@/db/types/tables';

type Database = typeof db;
export default class Fixture extends Base<InsertFixture, SelectFixture> {
  table = fixtures;

  constructor(db: Database) {
    super(db);
  }
}

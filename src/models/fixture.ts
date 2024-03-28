import Base from './base';
import { fixtures } from '@/db/schema';
import { InsertFixture, SelectFixture } from '@/db/types/tables';
import { Database, QueryKeys } from '@/db/types/database'
import { AnyTable } from 'drizzle-orm';
export default class Fixture extends Base<InsertFixture, SelectFixture> {
  table = fixtures;
  name: QueryKeys = 'fixtures';

  constructor(db: Database) {
    super(db);
  }
}

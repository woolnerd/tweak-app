import Base from './base';
import { fixtures } from '@/db/schema';
import { InsertFixture, SelectFixture } from '@/db/types/tables';
import { Database } from '@/db/types/database'
export default class Fixture extends Base<InsertFixture, SelectFixture> {
  table = fixtures;

  constructor(db: Database) {
    super(db);
  }
}

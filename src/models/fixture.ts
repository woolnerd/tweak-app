import Base from './base';
import { fixtures } from '@/db/schema';
import { InsertFixture, SelectFixture, TableNames } from '@/db/types/tables';
import { Database, QueryKeys } from '@/db/types/database'
export default class Fixture extends Base<InsertFixture, SelectFixture> {
  readonly table = fixtures;
  readonly name: QueryKeys = TableNames.Fixtures;

  constructor(db: Database) {
    super(db);
  }
}

import { db, FixtureInsert, FixtureSelect } from '@/db/drizzle';
import Base from './base';
import { fixtures } from '@/db/schema';

export default class Fixture extends Base<
  FixtureInsert,
  FixtureSelect
> {
  readonly database = db;
  async create(fixture: FixtureInsert): Promise<FixtureSelect> {
    return await db.insert(fixtures).values(fixture).returning()
  }
}

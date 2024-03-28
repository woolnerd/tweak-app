// import { db, FixtureInsert, FixtureSelect } from '@/db/drizzle';
// import { eq } from 'drizzle-orm';
import Base from './base';
import { fixtures } from '@/db/schema';
import { db } from '@/db/drizzle';

type NewFixture = typeof fixtures.$inferInsert;
type SelectFixture = typeof fixtures.$inferSelect;
type Database = typeof db;
export default class Fixture extends Base<NewFixture, SelectFixture> {
  table = fixtures;
  // database = db;

  constructor(db: Database ) {
    super(db);
  }

  // async create(fixture: NewFixture) {
  //   return await db.insert(fixtures).values(fixture).returning()
  // }

  // async getAll(selection = null) {
  //   if (selection) {
  //     return await db.select(selection).from(fixtures);
  //   }
  //   return await db.select().from(fixtures);
  // }

  // async getById(fixtureId: number) {
  //   return await db.select().from(fixtures).where(eq(fixtures.id, fixtureId));
  // }

  // async update(data: FixtureSelect) {
  //   const { id, ...restData } = data;

  //   return await db.update(fixtures).set(restData).where(eq(fixtures.id, id)).returning();
  // }

  // async delete(fixtureId: number) {
  //   return await db.delete(fixtures).where(eq(fixtures.id, fixtureId)).returning();
  // }
}

import { AnyTable, BuildQueryResult, DBQueryConfig, eq } from 'drizzle-orm';
import { Database, QueryKeys, MyQueryHelper } from '@/db/types/database';
import { QueryBuilder } from 'drizzle-orm/sqlite-core';
export default abstract class Base<T, K extends { id: number }> {
  abstract readonly table: AnyTable<{columns: {id: any}}> & {id: any};
  abstract readonly name: QueryKeys
  protected db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(data: any){
    return await this.db.insert(this.table).values(data).returning();
  }

  async getAll(options?: DBQueryConfig) {
    return await (this.db.query[this.name] as MyQueryHelper).findMany(options)
  }

  async getById(id: number) {
   return await this.db.select().from(this.table).where(eq(this.table.id, id));
  }

  async update(data: K) {
    const { id, ...restData } = data;
    return await this.db.update(this.table).set(restData).where(eq(this.table.id, id)).returning()
  }

  async delete(id: number) {
    return await this.db.delete(this.table).where(eq(this.table.id, id)).returning();
  }
}

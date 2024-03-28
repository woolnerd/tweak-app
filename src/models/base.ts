import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import  * as schema  from '@/db/schema'
import { SQLiteInsertBase, SQLiteTable, SQLiteTableWithColumns, TableConfig } from 'drizzle-orm/sqlite-core';

type Database = typeof db
// type IntersectionOfSelects<T extends typeof schema> =
//   T[keyof T] extends { InferSelect(): infer U } ? U : never;
export default abstract class Base<T, K extends { id: number }> {
  abstract readonly table: any;
  protected db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(data: any){
    return await this.db.insert(this.table).values(data).returning();
  }

  async getAll(options?: {}) {
    return await this.db.select().from(this.table);
  }

  async getById(id: number) {
   return await this.db.select().from(this.table).where(eq(this.table.id, id));
  }

  async update(data: K) {
    const { id, ...restData } = data;
    return await this.db.update(this.table).set(restData).where(eq(this.table.id,id )).returning()
  }

  async delete(id: number) {
    return await this.db.delete(this.table).where(eq(this.table.id, id)).returning();
  }
}

import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import  * as schema  from '@/db/schema'
import { SQLiteInsertBase, SQLiteTable, SQLiteTableWithColumns, TableConfig } from 'drizzle-orm/sqlite-core';

export default abstract class Base<T, K extends { id: number }> {
  abstract readonly table: any;

  async create(data: any) {
    return await db.insert(this.table).values(data).returning();
  }

  async getAll(options?: {}) {
    return await db.select().from(this.table);
  }

  async getById(id: number) {
   return await db.select().from(this.table).where(eq(this.table.id, id));
  }

  async update(data: K) {
    const { id, ...restData } = data;
    return await db.update(this.table).set(restData).where(eq(this.table.id,id )).returning()
  }

  async delete(id: number) {
    return await db.delete(this.table).where(eq(this.table.id, id)).returning();
  }
}

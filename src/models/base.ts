import { db } from '@/db/client';
import { eq } from 'drizzle-orm';

type Database = typeof db
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

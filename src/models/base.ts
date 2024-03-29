import { DBQueryConfig, eq } from 'drizzle-orm';
import { Database, QueryKeys, MyQueryHelper } from '@/db/types/database';
export default abstract class Base<T, K extends { id: number }> {
  abstract readonly table: any;
  abstract readonly name: QueryKeys
  protected db: Database;
  private handleError(error: unknown): void {
    if (error instanceof Error) {
      throw new Error(`Database operation failed: ${error.message}`);
    } else {
      throw new Error('Database operation failed with unknown error');
    }
  }

  constructor(db: Database) {
    this.db = db;
  }

  async create(data: any) {
    try {
      return await this.db.insert(this.table).values(data).returning();
    } catch (err) {
      this.handleError(err);
    }
  }

  async getAll(options: any) {
    try {
      return await (this.db.query[this.name] as MyQueryHelper).findMany(options);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getById(id: number) {
    try {
      return await this.db.select().from(this.table).where(eq(this.table.id, id));
    } catch (err) {
      this.handleError(err);
    }
  }

  async update({ id, ...restData } : K) {
    try {
      return await this.db.update(this.table).set(restData).where(eq(this.table.id, id)).returning()
    } catch (err) {
      this.handleError(err);
    }
  }

  async delete(id: number) {
    try {
      const result = await this.db.delete(this.table).where(eq(this.table.id, id)).returning();
      if (result.length === 0) {
        throw new Error(`No record found with id ${id}`);
      }
      return result;
    } catch (err) {
      this.handleError(err);
    }
  }
}

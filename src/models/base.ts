import { eq } from "drizzle-orm";
import { SQLiteInsertValue, TableConfig, SQLiteTable } from "drizzle-orm/sqlite-core";

import { Database, QueryKeys, MyQueryHelper } from "@/db/types/database";
import { handleDatabaseError } from "@/util/errors";
export default abstract class Base<T extends SQLiteTable<TableConfig>, K extends { id: number }> {
  abstract readonly table: any;
  abstract readonly name: QueryKeys;
  protected db: Database;
  protected handleError(error: unknown) {}

  constructor(db: Database) {
    this.db = db;
    this.handleError = handleDatabaseError;
  }

  async create(
    data: SQLiteInsertValue<T> | SQLiteInsertValue<T>[],
  ): Promise<typeof this.table.$inferInsert> {
    try {
      return await this.db.insert(this.table).values(data).returning();
    } catch (err) {
      this.handleError(err);
    }
  }
  async getAll(options?: any): Promise<typeof this.table.$inferSelect> {
    try {
      return await (this.db.query[this.name] as MyQueryHelper).findMany(options);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getById(id: number): Promise<typeof this.table.$inferSelect> {
    try {
      return await this.db.select().from(this.table).where(eq(this.table.id, id));
    } catch (err) {
      this.handleError(err);
    }
  }

  async update({ id, ...restData }: K): Promise<typeof this.table.$inferSelect> {
    try {
      return await this.db
        .update(this.table)
        .set(restData)
        .where(eq(this.table.id, id))
        .returning();
    } catch (err) {
      this.handleError(err);
    }
  }

  async delete(id: number): Promise<typeof this.table.$inferSelect> {
    try {
      const result = await this.db.delete(this.table).where(eq(this.table.id, id)).returning();

      if (result instanceof Array && result.length === 0) {
        throw new Error(`No record found with id ${id}`);
      }

      return result;
    } catch (err) {
      this.handleError(err);
    }
  }
}

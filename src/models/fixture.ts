import { eq } from "drizzle-orm";

import Base from "./base.ts";
import { fixtures } from "../db/schema.ts";
import { QueryKeys } from "../db/types/database.ts";
import { SelectFixture, TableNames } from "../db/types/tables.ts";

export default class Fixture extends Base<typeof fixtures, SelectFixture> {
  readonly table = fixtures;

  readonly name: QueryKeys = TableNames.Fixtures;

  async getByManufacturerId(id: number) {
    try {
      return await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.manufacturerId, id));
    } catch (err) {
      return this.handleError(err);
    }
  }
}

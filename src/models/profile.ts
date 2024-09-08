import { eq } from "drizzle-orm";

import Base from "./base.ts";
import { profiles } from "../db/schema.ts";
import { QueryKeys } from "../db/types/database.ts";
import { SelectProfile, TableNames } from "../db/types/tables.ts";

export default class Profile extends Base<typeof profiles, SelectProfile> {
  readonly table = profiles;

  readonly name: QueryKeys = TableNames.Profiles;

  async getByFixtureId(fixtureId: number) {
    try {
      return await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.fixtureId, fixtureId));
    } catch (err) {
      return this.handleError(err);
    }
  }
}

import { eq, sql } from "drizzle-orm";

import Base from "./base.ts";
import { profiles } from "../db/schema.ts";
import { QueryKeys } from "../db/types/database.ts";
import { SelectProfile, TableNames } from "../db/types/tables.ts";

export type ProfileProcessed = SelectProfile & {
  is16Bit: boolean;
  channelCount: number;
};

export default class Profile extends Base<typeof profiles, SelectProfile> {
  readonly table = profiles;

  readonly name: QueryKeys = TableNames.Profiles;

  async getByFixtureId(fixtureId: number): Promise<ProfileProcessed[]> {
    try {
      return await this.db
        .select({
          id: this.table.id,
          name: this.table.name,
          channels: this.table.channels,
          channelPairs16Bit: this.table.channelPairs16Bit,
          fixtureId: this.table.fixtureId,
          is16Bit: sql<boolean>`CASE
                                  WHEN json_array_length(json(${this.table.channelPairs16Bit})) > 0 THEN TRUE
                                  ELSE FALSE
                                  END`.as("is16Bit"),
          channelCount:
            sql<number>`(SELECT COUNT(*) FROM json_each(json(${this.table.channels})))`.as(
              "channelCount",
            ),
        })
        .from(this.table)
        .where(eq(this.table.fixtureId, fixtureId));
    } catch (err) {
      return this.handleError(err);
    }
  }
}

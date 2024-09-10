import { gte, lte, and, or, eq, sql } from "drizzle-orm";

import Base from "./base.ts";
import { db } from "../db/client.ts";
import { patches, profiles } from "../db/schema.ts";
import { InsertPatch, SelectPatch, TableNames } from "../db/types/tables.ts";

export default class Patch extends Base<typeof patches, SelectPatch> {
  readonly table = patches;

  readonly name = TableNames.Patches;

  readonly MIN_START_ADDRESS = 1;

  async getAll(options?: any) {
    const { id, startAddress, fixtureId, profileId, showId } = this.table;
    try {
      return await this.db
        .select({
          id,
          startAddress,
          fixtureId,
          profileId,
          showId,
          profileChannels: profiles.channels,
        })
        .from(this.table)
        .leftJoin(profiles, eq(profiles.id, this.table.profileId));
    } catch (err) {
      console.log(err);

      return this.handleError(err);
    }
  }

  async create(data: InsertPatch, endAddress: number) {
    if (data.startAddress > endAddress) {
      throw Error(
        `Starting address (${data.startAddress}) cannot be greater than ending address (${endAddress}).`,
      );
    }

    if (data.startAddress < this.MIN_START_ADDRESS) {
      throw Error("Starting address must be 1 or greater");
    }

    const isOverlap = await this.checkOverlap(
      data.startAddress,
      endAddress,
      data.showId,
    );

    if (isOverlap) {
      throw new Error("Address overlaps with current patch address in scene");
    }

    return await this.db.insert(patches).values(data).returning();
  }

  private async checkOverlap(
    startAddressForCheck: number,
    endAddressForCheck: number,
    showIdForCheck: number,
  ): Promise<boolean> {
    const OFFSET_BY_ONE = 1;
    const overlappingPatches = await db
      .select()
      .from(patches)
      .where(
        sql`NOT (
        ${endAddressForCheck} < ${this.table.startAddress} OR
        ${startAddressForCheck} > (
          ${this.table.startAddress} + (
            SELECT COUNT(*)
            FROM json_each(${profiles.channels})
          ) - ${OFFSET_BY_ONE}
        )
      ) AND ${this.table.showId} = ${showIdForCheck}`,
      )
      .leftJoin(profiles, eq(this.table.profileId, profiles.id));

    return overlappingPatches.length > 0;
  }
}

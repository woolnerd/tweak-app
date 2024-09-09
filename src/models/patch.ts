import { gte, lte, and, or, eq } from "drizzle-orm";

import Base from "./base.ts";
import { db } from "../db/client.ts";
import { patches, profiles } from "../db/schema.ts";
import { InsertPatch, SelectPatch, TableNames } from "../db/types/tables.ts";

export default class Patch extends Base<typeof patches, SelectPatch> {
  readonly table = patches;

  readonly name = TableNames.Patches;

  readonly MIN_START_ADDRESS = 1;

  // TODO
  // join patches and profiles
  // use Profile channels length + patch.startAddress - 1 to derive endAddress
  // return patch objects with endAddress populated

  // update patch creation, using the selected to profile to check if there is a conflict with starting address of patches

  async getAll(options?: any) {
    try {
      return await this.db
        .select({ ...this.table, profileChannels: profiles.channels })
        .from(this.table)
        .leftJoin(profiles, eq(profiles.id, this.table.profileId));
    } catch (err) {
      console.log(err);

      return this.handleError(err);
    }
  }

  async create(data: InsertPatch, endAddress: number) {
    // we join with profile to get the channel length, so we can derive endAddress
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

    return await this.db.insert(patches).values(data);
  }

  async checkOverlap(
    startAddressForCheck: number,
    endAddressForCheck: number,
    showIdForCheck: number,
  ): Promise<boolean> {
    const overlaps = await this.db
      .select()
      .from(this.table)
      .where(
        and(
          or(
            and(
              lte(this.table.startAddress, startAddressForCheck),
              // gte(endAddress, startAddressForCheck),
            ),
            and(
              lte(this.table.startAddress, endAddressForCheck),
              // gte(endAddress, endAddressForCheck),
            ),
          ),
          eq(this.table.showId, showIdForCheck),
        ),
      );

    return overlaps.length > 0;
  }
}

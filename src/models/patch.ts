import { gte, lte, and, or, eq } from "drizzle-orm";

import Base from "./base.ts";
import { patches } from "../db/schema.ts";
import { InsertPatch, SelectPatch, TableNames } from "../db/types/tables.ts";

export default class Patch extends Base<typeof patches, SelectPatch> {
  readonly table = patches;

  readonly name = TableNames.Patches;

  readonly MIN_START_ADDRESS = 1;

  async create(data: InsertPatch) {
    if (data.startAddress > data.endAddress) {
      throw Error(
        `Starting address (${data.startAddress}) cannot be greater than ending address (${data.endAddress}).`,
      );
    }

    if (data.startAddress < this.MIN_START_ADDRESS) {
      throw Error("Starting address must be 1 or greater");
    }

    const isOverlap = await this.checkOverlap(
      data.startAddress,
      data.endAddress,
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
              gte(this.table.endAddress, startAddressForCheck),
            ),
            and(
              lte(this.table.startAddress, endAddressForCheck),
              gte(this.table.endAddress, endAddressForCheck),
            ),
          ),
          eq(this.table.showId, showIdForCheck),
        ),
      );

    return overlaps.length > 0;
  }
}

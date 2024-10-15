import { eq, sql } from "drizzle-orm";

import Base from "./base.ts";
import { db } from "../db/client.ts";
import { patches, profiles } from "../db/schema.ts";
import { InsertPatch, SelectPatch, TableNames } from "../db/types/tables.ts";

export type PatchAfterProcess = SelectPatch & { endAddress: number };
type PatchBeforeProcess = SelectPatch & {
  profileChannels?: string | null;
};
export default class Patch extends Base<typeof patches, SelectPatch> {
  readonly table = patches;

  readonly name = TableNames.Patches;

  readonly MIN_START_ADDRESS = 1;

  private unproccessedData: Awaited<PatchBeforeProcess[]>;

  private processedData: PatchAfterProcess[];

  async getAll(options?: any) {
    const { id, startAddress, fixtureId, profileId, showId } = this.table;
    try {
      this.unproccessedData = await this.db
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

    this.processData();
    return this.processedData;
  }

  async create(data: InsertPatch & { channel: number; endAddress: number }) {
    console.log({ data });

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
        sql`${startAddressForCheck} <= (
                ${this.table.startAddress} + (
                  SELECT COUNT(*)
                  FROM json_each(${profiles.channels})
                ) - ${OFFSET_BY_ONE}
              )
              AND ${endAddressForCheck} >= ${this.table.startAddress}
              AND ${this.table.showId} = ${showIdForCheck}`,
      )
      .leftJoin(profiles, eq(this.table.profileId, profiles.id));

    console.log({ overlappingPatches });

    return overlappingPatches.length > 0;
  }

  private processData() {
    this.addEndAddressField();
  }

  private addEndAddressField() {
    this.processedData = this.unproccessedData.map((obj): PatchAfterProcess => {
      const profileChannels: Record<number, string> = obj.profileChannels
        ? JSON.parse(obj.profileChannels)
        : [];

      delete obj.profileChannels;

      return {
        ...obj,
        endAddress: Patch.getEndAddress(obj.startAddress, profileChannels),
      };
    });
  }

  private static getEndAddress(
    startAddress: number,
    channels: Record<number, string>,
  ) {
    return Object.values(channels).length > 0
      ? startAddress + Object.values(channels).length - 1
      : startAddress;
  }
}

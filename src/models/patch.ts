import Base from './base';
import { patches } from '@/db/schema';
import { InsertPatch, SelectPatch, TableNames } from '@/db/types/tables';
import { db } from '@/db/client';
import { gte, lte, and, or, eq } from 'drizzle-orm';

export default class Patch extends Base<InsertPatch, SelectPatch> {
  readonly table = patches;
  readonly name = TableNames.Patches;

  async create(data: InsertPatch) {
    if (data.startAddress > data.endAddress) {
      throw Error('Starting address cannot be greater then ending address.');
    }

    if (data.startAddress < 1) {
      throw Error('Starting address must be 1 or greater');
    }

    const isOverlap = await this.checkOverlap(
      data.startAddress,
      data.endAddress,
      data.showId
    );

    if (isOverlap) {
      throw new Error('Address overlaps with current patch address in scene');
    }

    return await db.insert(patches).values(data);
  }

  async checkOverlap(
    startAddressForCheck: number,
    endAddressForCheck: number,
    showIdForCheck: number
  ): Promise<boolean> {
    const overlaps = await db
      .select()
      .from(this.table)
      .where(
        and(
          or(
            and(
              lte(this.table.startAddress, startAddressForCheck),
              gte(this.table.endAddress, startAddressForCheck)
            ),
            and(
              lte(this.table.startAddress, endAddressForCheck),
              gte(this.table.endAddress, endAddressForCheck)
            )
          ),
          eq(this.table.showId, showIdForCheck)
        )
      );

    return overlaps.length > 0;
  }
}

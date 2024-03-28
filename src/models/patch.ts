import Base from './base';
import { patches } from '@/db/schema';
import {
  InsertPatch,
  SelectPatch,
} from '@/db/types/tables';
import { db } from '@/db/client';

export default class Patch extends Base<InsertPatch, SelectPatch> {
  table = patches;

  async create(
    data: InsertPatch,
    options: { sceneId: number }
  ): Promise<SelectPatch> {

    if (data.startAddress > data.endAddress) {
      throw Error('Starting address cannot be greater then ending address.');
    }

    const isOverlap = await this.checkOverlap(
      data.startAddress,
      data.endAddress,
      options.sceneId
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
    const overlaps = await prisma.patch.findMany({
      where: {
        showId: showIdForCheck,
        OR: [
          {
            AND: [
              { startAddress: { lte: startAddressForCheck } },
              { endAddress: { gte: startAddressForCheck } },
            ],
          },
          {
            AND: [
              { startAddress: { lte: endAddressForCheck } },
              { endAddress: { gte: endAddressForCheck } },
            ],
          },
        ],
      },
    });

    return overlaps.length > 0;
  }
}

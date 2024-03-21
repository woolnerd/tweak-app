import { Prisma, Patch as PatchType, Scene } from '@prisma/client';
import prisma from '@/lib/prisma';
import Base from './base';

export default class Patch extends Base<Prisma.PatchCreateInput, PatchType> {
  prisma = prisma.patch;

  async create(
    data: Prisma.PatchCreateInput,
    options: { sceneId: number }
  ): Promise<PatchType> {
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

    return await prisma.patch.create({
      data,
    });
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

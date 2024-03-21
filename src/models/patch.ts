import { Prisma, Patch } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function createPatch(
  patch: Prisma.PatchCreateInput,
  sceneId: number
) {
  if (patch.startAddress > patch.endAddress) {
    throw Error('Starting address cannot be greater then ending address.');
  }

  const isOverlap = await checkOverlap(
    patch.startAddress,
    patch.endAddress,
    sceneId
  );

  if (isOverlap) {
    throw new Error('Address overlaps with current patch address in scene');
  }

  return await prisma.patch.create({
    data: patch,
  });
}

export async function checkOverlap(
  startAddressForCheck: number,
  endAddressForCheck: number,
  showIdForCheck: number
) {
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

export async function getAllPatches() {
  return await prisma.patch.findMany();
}

export async function getPatch(patchId: number) {
  return await prisma.patch.findUnique({ where: { id: patchId } });
}

export async function updatePatch(patch: Patch) {
  return await prisma.patch.update({
    where: { id: patch.id },
    data: patch,
  });
}

export async function deletePatch(patchId: number) {
  return await prisma.patch.delete({
    where: { id: patchId },
  });
}

import { Prisma, Patch } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function createPatch(patch: Prisma.PatchCreateInput) {
  if (patch.startAddress > patch.endAddress) {
    throw Error('Starting address cannot be greater then ending address.');
  }

  return await prisma.patch.create({
    data: patch,
  });
}

export async function checkIfPatchAddressIsAvailableInShow(
  startAddressForCheck: number,
  endAddressForCheck: number,
  showIdForCheck: number
) {
  await prisma.patch.findFirst({
    where: {
      showId: showIdForCheck,
      AND: {
        startAddress: { gte: startAddressForCheck, lte: endAddressForCheck },
        endAddress: { lte: endAddressForCheck },
      },
    },
  });
}

// 1..10
// 5..15

// 50..60
// 40..55

export async function getAllPatchs() {
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

import {
  createPatch,
  deletePatch,
  getAllPatchs,
  getPatch,
  updatePatch,
} from '../patch';
import { Prisma, Patch } from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma';

const mockPatch: Patch = {
  id: 1,
  fixtureId: 1,
  profileId: 1,
  startAddress: 1,
  endAddress: 20,
  showId: 1,
};

describe('Patch model', () => {
  test('should create a new patch', async () => {
    const patch: Prisma.PatchCreateInput = {
      fixture: { connect: { id: 1 } },
      profile: { connect: { id: 1 } },
      startAddress: 1,
      endAddress: 20,
      show: { connect: { id: 1 } },
    };

    prismaMock.patch.create.mockResolvedValue(mockPatch);
    await expect(createPatch(patch)).resolves.toEqual(mockPatch);
    expect(prismaMock.patch.create).toHaveBeenCalledTimes(1);
  });

  test('attempting to create a patch with overlapping startAddress and endAddress in the same scene throws exception', () => {});

  test("should get patch by it's id", async () => {
    prismaMock.patch.findUnique.mockResolvedValue(mockPatch);

    await expect(getPatch(mockPatch.id)).resolves.toEqual(mockPatch);
  });

  test('should find all patchs', async () => {
    const mockPatches = [
      {
        id: 1,
        fixtureId: 1,
        profileId: 1,
        startAddress: 1,
        endAddress: 20,
        showId: 1,
      },
      {
        id: 2,
        fixtureId: 1,
        profileId: 1,
        startAddress: 21,
        endAddress: 40,
        showId: 1,
      },
    ];

    prismaMock.patch.findMany.mockResolvedValue(mockPatches);

    await expect(getAllPatchs()).resolves.toHaveLength(2);
    await expect(getAllPatchs()).resolves.toBe(mockPatches);
  });

  test('should update a patch', async () => {
    prismaMock.patch.update.mockResolvedValue(mockPatch);

    await expect(updatePatch(mockPatch)).resolves.toEqual({
      id: 1,
      fixtureId: 1,
      profileId: 1,
      startAddress: 1,
      endAddress: 20,
      showId: 1,
    });

    expect(prismaMock.patch.update).toHaveBeenCalledTimes(1);
  });

  test('should delete a patch', async () => {
    prismaMock.patch.delete.mockResolvedValue(mockPatch);

    await expect(deletePatch(1)).resolves.toEqual(mockPatch);
  });
});

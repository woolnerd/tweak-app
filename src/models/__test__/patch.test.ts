import Patch from '../patch';
import { Prisma, Patch as PatchType } from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma';

const mockPatch: PatchType = {
  id: 1,
  fixtureId: 1,
  profileId: 1,
  startAddress: 1,
  endAddress: 20,
  showId: 1,
};

const sceneId = 1;

describe('Patch model', () => {
  test('should create a new patch', async () => {
    const patch: Prisma.PatchCreateInput = {
      fixture: { connect: { id: 1 } },
      profile: { connect: { id: 1 } },
      startAddress: 1,
      endAddress: 20,
      show: { connect: { id: 1 } },
    };

    prismaMock.patch.findMany.mockResolvedValue([]);
    prismaMock.patch.create.mockResolvedValue(mockPatch);
    await expect(new Patch().create(patch, { sceneId })).resolves.toEqual(
      mockPatch
    );
    expect(prismaMock.patch.create).toHaveBeenCalledTimes(1);
  });

  it('should detect overlap when creating a new patch in same scene', async () => {
    prismaMock.patch.findMany.mockResolvedValue([
      {
        id: 1,
        startAddress: 100,
        endAddress: 200,
        fixtureId: 1,
        profileId: 1,
        showId: 1,
      },
    ]);

    await expect(new Patch().checkOverlap(1, 150, 1)).resolves.toBe(true);
    await expect(new Patch().checkOverlap(150, 200, 1)).resolves.toBe(true);
  });

  it('should not detect overlap when creating a new patch with overlapping addresses with different sceneIds', async () => {
    prismaMock.patch.findMany.mockResolvedValue([]);

    await expect(new Patch().checkOverlap(101, 199, 2)).resolves.toEqual(false);
  });

  it('should not detect overlap when creating a new patch with non-overlapping addresses', async () => {
    prismaMock.patch.findMany.mockResolvedValue([]);
    await expect(new Patch().checkOverlap(1, 50, 1)).resolves.toEqual(false);
    await expect(new Patch().checkOverlap(201, 220, 1)).resolves.toEqual(false);
  });

  test('attempting to create a patch with overlapping startAddress and endAddress in the same scene throws exception', async () => {
    prismaMock.patch.findMany.mockResolvedValue([
      {
        id: 1,
        startAddress: 10,
        endAddress: 30,
        fixtureId: 1,
        profileId: 1,
        showId: 1,
      },
    ]);

    const patch: Prisma.PatchCreateInput = {
      fixture: { connect: { id: 1 } },
      profile: { connect: { id: 1 } },
      startAddress: 1,
      endAddress: 20,
      show: { connect: { id: 1 } },
    };

    await expect(new Patch().create(patch, { sceneId })).rejects.toThrow(
      'Address overlaps with current patch address in scene'
    );
  });

  test("should get patch by it's id", async () => {
    prismaMock.patch.findUnique.mockResolvedValue(mockPatch);

    await expect(new Patch().getById(mockPatch.id)).resolves.toEqual(mockPatch);
  });

  test('should find all patches', async () => {
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

    await expect(new Patch().getAll()).resolves.toHaveLength(2);
    await expect(new Patch().getAll()).resolves.toBe(mockPatches);
  });

  test('should update a patch', async () => {
    prismaMock.patch.update.mockResolvedValue(mockPatch);

    await expect(new Patch().update(mockPatch)).resolves.toEqual({
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

    await expect(new Patch().delete(1)).resolves.toEqual(mockPatch);
  });
});

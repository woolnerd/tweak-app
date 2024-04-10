import Patch from "../patch";

import { db } from "@/db/client";
import { Database } from "@/db/types/database";
import {
  insertPatch,
  mockDbInsert,
  mockDbSelectNoOverlap,
  mockDbSelectOverlap,
  selectPatch,
} from "@/models/__mocks__/patch.mock";

jest.mock("@/db/client", () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
  },
}));

describe("Patch", () => {
  let patch: Patch;
  let mockDb: Database;
  const MIN_START_ADDRESS = 1;

  beforeEach(() => {
    mockDb = db;
    patch = new Patch(mockDb);
  });

  test("create throws error when startAddress greater than endAddress", async () => {
    const errorPatch = { ...insertPatch, startAddress: 10, endAddress: 1 };
    await expect(patch.create(errorPatch)).rejects.toThrow(
      `Starting address (${errorPatch.startAddress}) cannot be greater than ending address (${errorPatch.endAddress}).`,
    );
  });

  test("create should throw an error if startAddress is less than 1", async () => {
    await expect(
      patch.create({ ...insertPatch, startAddress: MIN_START_ADDRESS - 1 }),
    ).rejects.toThrow("Starting address must be 1 or greater");
  });

  test("checkOverlap returns true when overlap exists", async () => {
    const startAddressForCheck = 5;
    const endAddressForCheck = 15;
    const showIdForCheck = 1;

    mockDbSelectOverlap(mockDb, [selectPatch]);

    const result = await patch.checkOverlap(
      startAddressForCheck,
      endAddressForCheck,
      showIdForCheck,
    );
    expect(result).toBe(true);
  });

  test("create calls insert method when data is valid", async () => {
    mockDbSelectOverlap(mockDb, []);

    (mockDb.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockResolvedValue(insertPatch),
    });

    await patch.create(insertPatch);

    expect(mockDb.insert).toHaveBeenCalledWith(expect.anything());
    expect(mockDb.insert({} as any).values).toHaveBeenCalledWith({
      startAddress: 1,
      endAddress: 10,
      fixtureId: 1,
      profileId: 1,
      showId: 1,
    });
  });
});

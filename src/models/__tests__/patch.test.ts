import { Database } from "../../db/types/database.ts";
import { insertPatch, mockDbInsert } from "../__mocks__/patch.ts";
import Patch from "../patch.ts";

jest.mock("../../db/client", () =>
  jest.fn().mockReturnValue({
    db: {
      insert: jest.fn(),
      select: jest.fn(),
    },
  }),
);

describe("Patch", () => {
  let patch: Patch;
  const mockDb: Database = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnValue([1]),
  };
  const MIN_START_ADDRESS = 1;

  beforeEach(() => {
    patch = new Patch(mockDb);
  });

  test("create throws error new address conflicts with old address", async () => {
    const errorPatch = { ...insertPatch, startAddress: 10 };
    await expect(patch.create(errorPatch)).rejects.toThrow(
      "Address overlaps with current patch address in show",
    );
  });

  test("create should throw an error if startAddress is less than 1", async () => {
    await expect(
      patch.create({ ...insertPatch, startAddress: MIN_START_ADDRESS - 1 }),
    ).rejects.toThrow("Starting address must be 1 or greater");
  });

  test("create calls insert method when data is valid", async () => {
    mockDbInsert(mockDb, {
      id: 1,
      startAddress: 1,
      endAddress: 20,
      channel: 1,
      fixtureId: 1,
      profileId: 1,
      showId: 1,
    });
    await patch.create(insertPatch);

    expect(mockDb.insert).toHaveBeenCalledWith(expect.anything());
    expect(mockDb.insert({} as any).values).toHaveBeenCalledWith({
      channel: 1,
      startAddress: 1,
      fixtureId: 1,
      profileId: 1,
      showId: 1,
    });
  });
});

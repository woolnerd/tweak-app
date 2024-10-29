import { SelectFixture } from "../../db/types/tables.ts";
import * as mock from "../__mocks__/fixture.ts";
import Fixture from "../fixture.ts";

describe("Fixture model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should create a new fixture", async () => {
    const { mockInsertDb, mockFixture } = mock;

    const result: SelectFixture = await new Fixture(mockInsertDb).create(
      mockFixture,
    );
    expect(result.name).toEqual(mockFixture.name);
    expect(result.notes).toEqual(mockFixture.notes);
    expect(result.manufacturerId).toEqual(mockFixture.manufacturerId);
    expect(mockInsertDb.insert).toHaveBeenCalledTimes(1);
  });

  test("should error when creating a fixture with missing required fields", async () => {
    const { mockInsertDb } = mock;
    const mockFixture = {
      name: "Test Fixture",
      notes: "Test notes",
      manufacturerId: null,
    };

    (mockInsertDb.returning as jest.Mock).mockRejectedValue(
      new Error("Database operation failed"),
    );

    await expect(new Fixture(mockInsertDb).create(mockFixture)).rejects.toThrow(
      "Database operation failed",
    );
  });

  test("should get fixture by it's id", async () => {
    const { mockGetByIdDb, mockFixture } = mock;

    await expect(
      new Fixture(mockGetByIdDb).getById(mockFixture.id),
    ).resolves.toEqual(mockFixture);
  });

  test("should find all fixtures", async () => {
    const { mockGetAllDb, mockFixtureArray } = mock;

    await expect(new Fixture(mockGetAllDb).getAll()).resolves.toHaveLength(2);
    await expect(new Fixture(mockGetAllDb).getAll()).resolves.toBe(
      mockFixtureArray,
    );
  });

  test("should update a fixture", async () => {
    const { mockUpdateDb, mockFixture } = mock;

    await expect(
      new Fixture(mockUpdateDb).update(mockFixture),
    ).resolves.toEqual(mockFixture);
  });

  test("should error when attempting to update fixture without id", async () => {
    const { mockUpdateDb } = mock;
    const mockFixture = {
      name: "Test Fixture",
      notes: "Test notes",
      manufacturerId: null,
      colorTempRangeLow: 2800,
      colorTempRangeHigh: 10000,
      id: 1,
    };

    (mockUpdateDb.returning as jest.Mock).mockRejectedValueOnce(
      new Error("Database operation failed"),
    );

    await expect(new Fixture(mockUpdateDb).update(mockFixture)).rejects.toThrow(
      "Database operation failed",
    );
  });
  test("should delete a fixture", async () => {
    const { mockDeleteDb, mockFixture } = mock;

    await expect(new Fixture(mockDeleteDb).delete(1)).resolves.toEqual(
      mockFixture,
    );
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    expect(mockDeleteDb.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteDb.where).toHaveBeenCalledTimes(1);
    expect(mockDeleteDb.returning).toHaveBeenCalledTimes(1);
  });
});

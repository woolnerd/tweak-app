import Fixture from "../fixture";
import { SelectFixture } from "@/db/types/tables";
import * as mock from "../__mocks__/fixture.mock";

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
    expect(mockDeleteDb.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteDb.where).toHaveBeenCalledTimes(1);
    expect(mockDeleteDb.returning).toHaveBeenCalledTimes(1);
  });
});

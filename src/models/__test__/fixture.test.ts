import Fixture from '../fixture';
import { mockInsertDb, mockGetByIdDb, mockFixture, mockFixtureArray, mockGetAllDb, mockDeleteDb, mockUpdateDb } from '../__mocks__/fixture';

describe('Fixture model', () => {

  test('should create a new fixture', async () => {

    const result = await new Fixture(mockInsertDb).create(mockFixture);
    expect(result.name).toEqual(mockFixture.name);
    expect(result.notes).toEqual(mockFixture.notes);
    expect(result.manufacturerId).toEqual(mockFixture.manufacturerId);
    expect(mockInsertDb.insert).toHaveBeenCalledTimes(1);
  });

  test("should get fixture by it's id", async () => {

    await expect(new Fixture(mockGetByIdDb).getById(mockFixture.id)).resolves.toEqual(mockFixture);
  });

  test('should find all fixtures', async () => {

    await expect(new Fixture(mockGetAllDb).getAll()).resolves.toHaveLength(2);
    await expect(new Fixture(mockGetAllDb).getAll()).resolves.toBe(mockFixtureArray);
  });

  test('should update a fixture', async () => {

    await expect(new Fixture(mockUpdateDb).update(mockFixture)).resolves.toEqual(mockFixture);
  });

  test('should delete a fixture', async () => {

    await expect(new Fixture(mockDeleteDb).delete(1)).resolves.toEqual(mockFixture);
    expect(mockDeleteDb.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteDb.where).toHaveBeenCalledTimes(1);
    expect(mockDeleteDb.returning).toHaveBeenCalledTimes(1)
  });
});

import Fixture from '../fixture';
import { SelectFixture } from '@/db/types/tables';
import * as mock from '../__mocks__/fixture.mock';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Fixture model', () => {

  test('should create a new fixture', async () => {
    const { mockInsertDb, mockFixture } = mock

    const result: SelectFixture = await new Fixture(mockInsertDb).create(mockFixture);
    expect(result.name).toEqual(mockFixture.name);
    expect(result.notes).toEqual(mockFixture.notes);
    expect(result.manufacturerId).toEqual(mockFixture.manufacturerId);
    expect(mockInsertDb.insert).toHaveBeenCalledTimes(1);
  });

  test("should get fixture by it's id", async () => {
    const { mockGetByIdDb, mockFixture } = mock

    await expect(new Fixture(mockGetByIdDb).getById(mockFixture.id)).resolves.toEqual(mockFixture);
  });

  test('should find all fixtures', async () => {
    const { mockGetAllDb, mockFixtureArray } = mock

    await expect(new Fixture(mockGetAllDb).getAll()).resolves.toHaveLength(2);
    await expect(new Fixture(mockGetAllDb).getAll()).resolves.toBe(mockFixtureArray);
  });

  test('should update a fixture', async () => {
    const { mockUpdateDb, mockFixture } = mock

    await expect(new Fixture(mockUpdateDb).update(mockFixture)).resolves.toEqual(mockFixture);
  });

  test('should delete a fixture', async () => {
    const { mockDeleteDb, mockFixture } = mock

    await expect(new Fixture(mockDeleteDb).delete(1)).resolves.toEqual(mockFixture);
    expect(mockDeleteDb.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteDb.where).toHaveBeenCalledTimes(1);
    expect(mockDeleteDb.returning).toHaveBeenCalledTimes(1)
  });
});

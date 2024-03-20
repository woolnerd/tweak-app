import {
  createFixture,
  deleteFixture,
  getAllFixtures,
  getFixture,
  updateFixture,
} from '../fixture';
import { Prisma } from '@prisma/client';
import { prismaMock } from '@/__mocks__/@prisma/prisma-mock';

const mockFixture = {
  id: 1,
  name: 'Test Fixture',
  notes: 'Test notes',
  assigned: true,
  manufacturerId: 1,
};

describe('Fixture model', () => {
  test('should create a new fixture', async () => {
    const fixture: Prisma.FixtureCreateInput = {
      name: 'Test Fixture',
      notes: 'Test notes',
      manufacturer: {
        connect: { id: 1 },
      },
    };

    prismaMock.fixture.create.mockResolvedValue(mockFixture);
    const result = await createFixture(fixture, 1); //second arg is not implemented by test
    expect(result.name).toEqual(fixture.name);
    expect(result.notes).toEqual(fixture.notes);
    expect(result.manufacturerId).toEqual(fixture.manufacturer?.connect?.id);
    expect(prismaMock.fixture.create).toHaveBeenCalledTimes(1);
  });

  test("should get fixture by it's id", async () => {
    const fixture = {
      id: 1,
      name: 'Test Fixture',
      notes: 'Test notes',
      assigned: true,
      manufacturerId: 1,
    };

    prismaMock.fixture.findUnique.mockResolvedValue(fixture);

    await expect(getFixture(fixture.id)).resolves.toEqual(fixture);
  });

  test('should find all fixtures', async () => {
    const fixtures = [
      {
        id: 1,
        name: 'Test Fixture1',
        notes: 'Test notes1',
        assigned: true,
        manufacturerId: 1,
      },
      {
        id: 2,
        name: 'Test Fixture2',
        notes: 'Test notes2',
        assigned: false,
        manufacturerId: 1,
      },
    ];
    prismaMock.fixture.findMany.mockResolvedValue(fixtures);

    await expect(getAllFixtures()).resolves.toHaveLength(2);
    await expect(getAllFixtures()).resolves.toBe(fixtures);
  });

  test('should update a fixture', async () => {
    const fixture = {
      id: 1,
      name: 'Test Fixture',
      notes: 'Test notes',
      assigned: true,
      manufacturerId: 1,
    };

    prismaMock.fixture.update.mockResolvedValue(fixture);

    await expect(updateFixture(fixture)).resolves.toEqual({
      id: 1,
      name: 'Test Fixture',
      notes: 'Test notes',
      assigned: true,
      manufacturerId: 1,
    });

    expect(prismaMock.fixture.update).toHaveBeenCalledTimes(1);
  });

  test('should delete a fixture', async () => {
    prismaMock.fixture.delete.mockResolvedValue(mockFixture);

    await expect(deleteFixture(1)).resolves.toEqual(mockFixture);
  });
});

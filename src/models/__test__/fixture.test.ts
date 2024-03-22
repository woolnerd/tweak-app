import Fixture from '../fixture';
import { Prisma, Fixture as FixtureType } from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma';

const mockFixture: FixtureType = {
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
    const result = await new Fixture().create(fixture, { manufacturerId: 1 });
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

    await expect(new Fixture().getById(fixture.id)).resolves.toEqual(fixture);
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

    await expect(new Fixture().getAll()).resolves.toHaveLength(2);
    await expect(new Fixture().getAll()).resolves.toBe(fixtures);
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

    await expect(new Fixture().update(fixture)).resolves.toEqual({
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

    await expect(new Fixture().delete(1)).resolves.toEqual(mockFixture);
  });
});

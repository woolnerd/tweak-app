import { db } from '@/db/client';
import Fixture from '../fixture';
// import { Prisma, Fixture as FixtureType } from '@prisma/client';
import { fixtureMock } from '../__mocks__/fixture';
// import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { fixtures } from '@/db/schema';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { mockDB } from '../__mocks__/fixture';
import { mockDeep } from 'jest-mock-extended';

type SelectFixture = typeof fixtures.$inferSelect;
type InsertFixture = typeof fixtures.$inferInsert;
type Database = typeof db;

const mockDatabase: Database = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(() => Promise.resolve(mockFixture)),
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn(() => Promise.resolve(mockFixture)),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  eq: jest.fn()
}

const mockFixture: SelectFixture = {
  id: 1,
  name: 'Test Fixture',
  notes: 'Test notes',
  assigned: true,
  manufacturerId: 1,
};

const mockInsertFixture: InsertFixture = {
  name: 'Test Fixture',
  notes: 'Test notes',
  assigned: true,
  manufacturerId: 1,
};

describe('Fixture model', () => {

  test('should create a new fixture', async () => {
    const fixture: InsertFixture = {
      name: 'Test Fixture',
      notes: 'Test notes',
      manufacturerId: 1
    };


    // drizzle.insert.mockResolvedValue(mockInsertFixture)

    const result = await new Fixture(mockDatabase).create(fixture);
    expect(result.name).toEqual(fixture.name);
    expect(result.notes).toEqual(fixture.notes);
    expect(result.manufacturerId).toEqual(fixture.manufacturerId);
    expect(mockDatabase.insert).toHaveBeenCalledTimes(1);
  });

  test("should get fixture by it's id", async () => {
    const fixture = {
      id: 1,
      name: 'Test Fixture',
      notes: 'Test notes',
      assigned: true,
      manufacturerId: 1,
    };

    // drizzleMock.fixture.findUnique.mockResolvedValue(fixture);

    await expect(new Fixture(mockDatabase).getById(mockFixture.id)).resolves.toEqual(mockFixture);
  });

  test('should find all fixtures', async () => {
    const mockDatabase2: Database = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(() => Promise.resolve(mockFixture)),
      select: jest.fn().mockReturnThis(),
      from: jest.fn(()=> Promise.resolve(fixtures)),
      where: jest.fn(() => Promise.resolve(mockFixture))
    }

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
    // drizzleMock.fixture.findMany.mockResolvedValue(fixtures);

    await expect(new Fixture(mockDatabase2).getAll()).resolves.toHaveLength(2);
    await expect(new Fixture(mockDatabase2).getAll()).resolves.toBe(fixtures);
  });

  test('should update a fixture', async () => {
    const mockDatabase3: Database = {
      returning: jest.fn(() => Promise.resolve(mockFixture)),
      update: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis()
    }

    const fixture = {
      id: 1,
      name: 'Test Fixture',
      notes: 'Test notes',
      assigned: true,
      manufacturerId: 1,
    };

    // drizzleMock.fixture.update.mockResolvedValue(fixture);

    await expect(new Fixture(mockDatabase3).update(fixture)).resolves.toEqual({
      id: 1,
      name: 'Test Fixture',
      notes: 'Test notes',
      assigned: true,
      manufacturerId: 1,
    });

    // expect(drizzleMock.fixture.update).toHaveBeenCalledTimes(1);
  });

  test('should delete a fixture', async () => {
    // drizzleMock.fixture.delete.mockResolvedValue(mockFixture);
    const mockDatabase3: Database = {
      returning: jest.fn(() => Promise.resolve(mockFixture)),
      update: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis()
    }
    // mockDatabase3.delete().where().returning.mockResolvedValue(mockFixture); // Mocking the resolved value


    await expect(new Fixture(mockDatabase3).delete(1)).resolves.toEqual(mockFixture);
    expect(mockDatabase3.delete).toHaveBeenCalledTimes(1);
    expect(mockDatabase3.where).toHaveBeenCalledTimes(1);
    expect(mockDatabase3.returning).toHaveBeenCalledTimes(1)

  });
});

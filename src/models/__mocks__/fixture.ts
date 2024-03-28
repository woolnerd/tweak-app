import { db } from "@/db/client"
import { fixtures } from '@/db/schema'

type SelectFixture = typeof fixtures.$inferSelect;
type InsertFixture = typeof fixtures.$inferInsert;
type Database = typeof db;

export const mockInsertDb: Database = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(() => Promise.resolve(mockFixture)),
}

export const mockGetByIdDb: Database = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn(() => Promise.resolve(mockFixture)),
}

export const mockGetAllDb: Database = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn(()=> Promise.resolve(mockFixtureArray)),
  where: jest.fn(() => Promise.resolve(mockFixture))
}

export const mockUpdateDb: Database = {
  returning: jest.fn(() => Promise.resolve(mockFixture)),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
}

export const mockDeleteDb: Database = {
  returning: jest.fn(() => Promise.resolve(mockFixture)),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis()
}

export const mockFixtureArray = [
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

export const mockFixture: SelectFixture = {
  id: 1,
  name: 'Test Fixture',
  notes: 'Test notes',
  assigned: true,
  manufacturerId: 1,
};

export const mockInsertFixture: InsertFixture = {
  name: 'Test Fixture',
  notes: 'Test notes',
  assigned: true,
  manufacturerId: 1,
};

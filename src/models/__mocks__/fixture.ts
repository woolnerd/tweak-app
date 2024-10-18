import { Database } from "../../db/types/database.ts";
import {
  SelectFixture,
  InsertFixture,
  TableNames,
} from "../../db/types/tables.ts";

export const mockFixtureArray: SelectFixture[] = [
  {
    id: 1,
    name: "Test Fixture1",
    notes: "Test notes1",
    manufacturerId: 1,
    colorTempRangeHigh: 10000,
    colorTempRangeLow: 2800,
  },
  {
    id: 2,
    name: "Test Fixture2",
    notes: "Test notes2",
    manufacturerId: 1,
    colorTempRangeHigh: 10000,
    colorTempRangeLow: 2800,
  },
];

export const mockFixture: SelectFixture = {
  id: 1,
  name: "Test Fixture",
  notes: "Test notes",
  manufacturerId: 1,
  colorTempRangeHigh: 10000,
  colorTempRangeLow: 2800,
};

export const mockInsertFixture: InsertFixture = {
  name: "Test Fixture",
  notes: "Test notes",
  manufacturerId: 1,
};

export const mockInsertDb: Database = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(() => Promise.resolve(mockFixture)),
};

export const mockGetByIdDb: Database = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn(() => Promise.resolve(mockFixture)),
};

export const mockGetAllDb: Database = {
  query: {
    [TableNames.Fixtures]: {
      findMany: jest.fn(() => Promise.resolve(mockFixtureArray)),
    },
  },
};

export const mockUpdateDb: Database = {
  returning: jest.fn(() => Promise.resolve(mockFixture)),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
};

export const mockDeleteDb: Database = {
  returning: jest.fn(() => Promise.resolve(mockFixture)),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
};

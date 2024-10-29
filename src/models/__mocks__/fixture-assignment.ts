import {
  SelectFixtureAssignment,
  InsertFixtureAssignment,
  TableNames,
} from "../../db/types/tables.ts";

export const mockInsertDb: any = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(() => Promise.resolve(mockFixtureAssignment)),
};

export const mockGetByIdDb: any = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn(() => Promise.resolve(mockFixtureAssignment)),
};

export const mockGetAllDb: any = {
  query: {
    [TableNames.FixtureAssignments]: {
      findMany: jest.fn(() => Promise.resolve(mockFixtureAssignmentArray)),
    },
  },
};

export const mockUpdateDb: any = {
  returning: jest.fn(() => Promise.resolve(mockFixtureAssignment)),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
};

export const mockDeleteDb: any = {
  returning: jest.fn(() => Promise.resolve(mockFixtureAssignment)),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
};

export const mockInsertFixtureAssignment: InsertFixtureAssignment = {
  channel: 1,
  fixtureId: 1,
  profileId: 1,
  patchId: 1,
};

export const mockFixtureAssignment: SelectFixtureAssignment = {
  id: 1,
  channel: 10,
  fixtureId: 1,
  profileId: 1,
  patchId: 1,
};

export const mockFixtureAssignmentArray: SelectFixtureAssignment[] = [
  {
    id: 1,
    channel: 1,
    fixtureId: 1,
    profileId: 1,
    patchId: 1,
  },
  {
    id: 2,
    channel: 2,
    fixtureId: 2,
    profileId: 2,
    patchId: 1,
  },
];

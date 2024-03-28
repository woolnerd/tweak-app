//@ts-nocheck
import { SelectFixtureAssignment, InsertFixtureAssignment } from "@/db/types/tables";
import { Database } from "@/db/types/database";

export const mockInsertDb: Database = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(() => Promise.resolve(mockFixtureAssignment)),
}

export const mockGetByIdDb: Database = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn(() => Promise.resolve(mockFixtureAssignment)),
}

export const mockGetAllDb: Database = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn(()=> Promise.resolve(mockFixtureAssignmentArray)),
  where: jest.fn(() => Promise.resolve(mockFixtureAssignment))
}

export const mockUpdateDb: Database = {
  returning: jest.fn(() => Promise.resolve(mockFixtureAssignment)),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
}

export const mockDeleteDb: Database = {
  returning: jest.fn(() => Promise.resolve(mockFixtureAssignment)),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
}

export const mockInsertFixtureAssignment: InsertFixtureAssignment = {
  title: 'Test Assignment',
  channel: 1,
  value: 50,
  fixtureId: 1,
  profileId: 1
};

export const mockFixtureAssignment: SelectFixtureAssignment = {
  id: 1,
  title: 'Test Fixture Assignment',
  channel: 10,
  value: 255,
  fixtureId: 1,
  profileId: 1,
};

export const mockFixtureAssignmentArray: SelectFixtureAssignment[] = [
  {
    id: 1,
    title: 'Assignment 1',
    channel: 1,
    value: 50,
    fixtureId: 1,
    profileId: 1,
  },
  {
    id: 2,
    title: 'Assignment 2',
    channel: 2,
    value: 60,
    fixtureId: 2,
    profileId: 2,
  },
];

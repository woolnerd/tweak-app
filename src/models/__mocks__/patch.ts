import { Database } from "../../db/types/database.ts";
import { SelectPatch, InsertPatch } from "../../db/types/tables.ts";

export const mockDbSelectOverlap = (db: Database, returnVal: SelectPatch[]) => {
  db.select = jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue(returnVal), // Simulating an existing patch
  });
};

export const mockDbSelectNoOverlap = (
  db: Database,
  returnVal: SelectPatch[],
) => {
  db.select = jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue(returnVal), // Simulating no existing patch
  });
};

export const mockDbInsert = (db: Database, returnVal: SelectPatch) => {
  mockDbSelectOverlap(db, []);

  db.insert = jest.fn().mockReturnValue({
    values: jest.fn().mockResolvedValue(returnVal),
  });
};

export const insertPatch: InsertPatch = {
  startAddress: 1,
  fixtureId: 1,
  profileId: 1,
  showId: 1,
};

export const selectPatch: SelectPatch = {
  id: 1,
  startAddress: 1,
  fixtureId: 1,
  profileId: 1,
  showId: 1,
};

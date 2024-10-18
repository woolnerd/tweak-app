import { Database } from "../../db/types/database.ts";
import { SelectPatch, InsertPatch } from "../../db/types/tables.ts";

export const mockDbSelectOverlap = (db: Database, returnVal: SelectPatch[]) => {
  db.select = jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(), // Simulating an existing patch
    leftJoin: jest.fn().mockResolvedValue(returnVal),
  });
};

export const mockDbSelectNoOverlap = (
  db: Database,
  returnVal: SelectPatch[],
) => {
  db.select = jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(), // Simulating no existing patch
    leftJoin: jest.fn().mockResolvedValue(returnVal),
  });
};

export const mockDbInsert = (
  db: Database,
  returnVal: SelectPatch & { endAddress: number; channel: number },
) => {
  mockDbSelectOverlap(db, []);

  db.insert = jest.fn().mockReturnValue({
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnValue(returnVal),
  });
};

export const insertPatch: InsertPatch & {
  channel: number;
  endAddress: number;
} = {
  startAddress: 1,
  endAddress: 20,
  channel: 1,
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

// import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
// import { db as drizzle } from '@/db/client';
// import * as drizzle from 'drizzle-orm';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { db } from '@/db/drizzle';
import Fixture from '../fixture';


jest.mock('@/db/drizzle', () => ({
  __esModule: true,
  default: mockDeep<ExpoSQLiteDatabase>(),
}));

// beforeEach(() => {
//   mockReset(mockDB);
// });

export const mockDB = db as unknown as DeepMockProxy<ExpoSQLiteDatabase>;

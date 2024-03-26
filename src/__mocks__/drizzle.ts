// import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { db as drizzle } from '@/db/client';

jest.mock('@/db/client', () => ({
  __esModule: true,
  default: mockDeep<ExpoSQLiteDatabase>(),
}));

beforeEach(() => {
  mockReset(drizzleMock);
});

export const drizzleMock = drizzle as unknown as DeepMockProxy<ExpoSQLiteDatabase>;

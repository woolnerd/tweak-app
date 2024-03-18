import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { CreatedFixture } from '@/services/db/models/fixture';

import prisma from '../lib/prisma';

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock: DeepMockProxy<PrismaClient> =
  mockDeep<PrismaClient>(prisma);

export const mockFixture: CreatedFixture = {
  id: 1,
  name: 'Test Fixture',
  notes: 'Test notes',
  assigned: false,
  manufacturerId: 1,
};

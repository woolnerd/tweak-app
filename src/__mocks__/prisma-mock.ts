import { PrismaClient, Fixture } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from '../lib/prisma';

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock: DeepMockProxy<PrismaClient> =
  mockDeep<PrismaClient>(prisma);

export const mockFixture: Fixture = {
  id: 1,
  name: 'Test Fixture',
  notes: 'Test notes',
  assigned: false,
  manufacturerId: 1,
};

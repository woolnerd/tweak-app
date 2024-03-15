import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createFixture(
  name: string,
  notes?: string,
  manufacturerId?: number
) {
  return await prisma.fixture.create({
    data: {
      name,
      notes,
      manufacturerId,
    },
  } as any);
}

// Other CRUD functions...

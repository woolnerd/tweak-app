import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Key } from 'react';

export type CreatedFixture = Prisma.PromiseReturnType<typeof createFixture>;

export async function createFixture(
  fixture: Prisma.FixtureCreateInput,
  manufacturerId: number
) {
  return await prisma.fixture.create({
    data: {
      ...fixture,
      manufacturer: {
        connect: { id: manufacturerId },
      },
    },
  });
}

export async function updateFixture(
  fixtureId: number,
  updateField: Prisma.FixtureUpdateInput
) {
  return await prisma.fixture.update({
    where: { id: fixtureId },
    data: { ...updateField },
  });
}

export async function deleteFixture(fixtureId: number) {
  return await prisma.fixture.delete({
    where: { id: fixtureId },
  });
}

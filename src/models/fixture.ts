import { Prisma, Fixture } from '@prisma/client';
import prisma from '@/lib/prisma';

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

export async function getAllFixtures() {
  return await prisma.fixture.findMany();
}

export async function getFixture(fixtureId: number) {
  return await prisma.fixture.findUnique({ where: { id: fixtureId } });
}

export async function updateFixture(fixture: Fixture) {
  return await prisma.fixture.update({
    where: { id: fixture.id },
    data: fixture,
  });
}

export async function deleteFixture(fixtureId: number) {
  return await prisma.fixture.delete({
    where: { id: fixtureId },
  });
}

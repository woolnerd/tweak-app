import { PrismaClient, FixtureAssignment, Prisma } from '@prisma/client';
// const prisma = new PrismaClient();
import { prismaMock } from '@/__mocks__/prisma';

interface GetAllOptions {
  scenes?: boolean;
  fixture?: boolean;
  profile?: boolean;
}

export async function createFixtureAssignment(
  fixtureAssignment: Prisma.FixtureAssignmentCreateInput
) {
  return await prismaMock.fixtureAssignment.create({ data: fixtureAssignment });
}

export async function getAllFixtureAssignments(options: GetAllOptions = {}) {
  return await prismaMock.fixtureAssignment.findMany({ include: options });
}

export async function getFixtureAssignment(fixtureAssignmentId: number) {
  return await prismaMock.fixtureAssignment.findUnique({
    where: { id: fixtureAssignmentId },
  });
}

export async function updateFixtureAssignment(
  fixtureAssignment: FixtureAssignment
) {
  return await prismaMock.fixtureAssignment.update({
    where: { id: fixtureAssignment.id },
    data: fixtureAssignment,
  });
}

export async function deleteFixtureAssignment(id: number) {
  return await prismaMock.fixtureAssignment.delete({ where: { id } });
}

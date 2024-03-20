import { PrismaClient, FixtureAssignment, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

interface GetAllOptions {
  scenes?: boolean;
  fixture?: boolean;
  profile?: boolean;
}

export async function createFixtureAssignment(
  fixtureAssignment: Prisma.FixtureAssignmentCreateInput
) {
  return await prisma.fixtureAssignment.create({ data: fixtureAssignment });
}

export async function getAllFixtureAssignments(options: GetAllOptions = {}) {
  return await prisma.fixtureAssignment.findMany({ include: options });
}

export async function getFixtureAssignment(fixtureAssignmentId: number) {
  return await prisma.fixtureAssignment.findUnique({
    where: { id: fixtureAssignmentId },
  });
}

export async function updateFixtureAssignment(
  fixtureAssignment: FixtureAssignment
) {
  return await prisma.fixtureAssignment.update({
    where: { id: fixtureAssignment.id },
    data: fixtureAssignment,
  });
}

export async function deleteFixtureAssignment(id: number) {
  return await prisma.fixtureAssignment.delete({ where: { id } });
}

import { PrismaClient, FixtureAssignment, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

export async function createFixtureAssignment(
  fixtureAssignment: Prisma.FixtureAssignmentCreateInput
) {
  return await prisma.fixtureAssignment.create({ data: fixtureAssignment });
}

export async function getAllFixtureAssignments() {
  return await prisma.fixtureAssignment.findMany();
}

export async function deleteFixtureAssignment(id: number) {
  return await prisma.fixtureAssignment.delete({ where: { id } });
}

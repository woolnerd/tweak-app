import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export interface FixtureAssignment {
  title: string;
  channel: number;
  value: number;
  fixtureId: number;
  profileId: number;
}

export async function createFixtureAssignment(
  fixtureAssignment: FixtureAssignment
) {
  return await prisma.fixtureAssignment.create({ data: fixtureAssignment });
}

export async function getAllFixtureAssignments() {
  return await prisma.fixtureAssignment.findMany();
}

export async function deleteFixtureAssignment(id: number) {
  return await prisma.fixtureAssignment.delete({ where: { id } });
}

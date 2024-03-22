import {
  FixtureAssignment as FixtureAssignmentType,
  Prisma,
} from '@prisma/client';
import prisma from '@/lib/prisma';
import Base from './base';
interface GetAllOptions {
  scenes?: boolean;
  fixture?: boolean;
  profile?: boolean;
}

export default class FixtureAssignment extends Base<
  Prisma.FixtureAssignmentCreateInput,
  FixtureAssignmentType
> {
  readonly prisma = prisma.fixtureAssignment;
  private DEFAULT_OPTIONS: Prisma.FixtureAssignmentFindManyArgs = {
    include: { fixture: false, profile: false, scenes: false },
  };

  async getAll(inputOptions: Prisma.FixtureAssignmentFindManyArgs = {}) {
    const options =
      Object.keys(inputOptions).length > 0
        ? inputOptions
        : this.DEFAULT_OPTIONS;

    return await prisma.fixtureAssignment.findMany(options);
  }
}

// export async function createFixtureAssignment(
//   fixtureAssignment: Prisma.FixtureAssignmentCreateInput
// ) {
//   return await prisma.fixtureAssignment.create({ data: fixtureAssignment });
// }

// export async function getAllFixtureAssignments(options: GetAllOptions = {}) {
//   return await prisma.fixtureAssignment.findMany({ include: options });
// }

// export async function getFixtureAssignment(fixtureAssignmentId: number) {
//   return await prisma.fixtureAssignment.findUnique({
//     where: { id: fixtureAssignmentId },
//   });
// }

// export async function updateFixtureAssignment(
//   fixtureAssignment: FixtureAssignment
// ) {
//   return await prisma.fixtureAssignment.update({
//     where: { id: fixtureAssignment.id },
//     data: fixtureAssignment,
//   });
// }

// export async function deleteFixtureAssignment(id: number) {
//   return await prisma.fixtureAssignment.delete({ where: { id } });
// }

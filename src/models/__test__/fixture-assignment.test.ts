import {
  createFixtureAssignment,
  getAllFixtureAssignments,
  deleteFixtureAssignment,
} from '../fixture-assignment';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma';

describe('Fixture Assignment Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createFixtureAssignment', async () => {
    const fixtureAssignmentData: Prisma.FixtureAssignmentCreateInput = {
      title: 'Test Assignment',
      channel: 1,
      value: 50,
      fixture: { connect: { id: 1 } },
      profile: { connect: { id: 1 } },
    };

    (prismaMock.fixtureAssignment.create as jest.Mock).mockResolvedValueOnce(
      fixtureAssignmentData
    );

    const result = await createFixtureAssignment(fixtureAssignmentData);
    expect(prismaMock.fixtureAssignment.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fixtureAssignmentData);
    expect(prismaMock.fixtureAssignment.create).toHaveBeenCalledWith({
      data: fixtureAssignmentData,
    });
  });

  test('getAllFixtureAssignments', async () => {
    const fixtureAssignmentsData = [
      {
        id: 1,
        title: 'Assignment 1',
        channel: 1,
        value: 50,
        fixtureId: 1,
        profileId: 1,
      },
      {
        id: 2,
        title: 'Assignment 2',
        channel: 2,
        value: 60,
        fixtureId: 2,
        profileId: 2,
      },
    ];

    (prismaMock.fixtureAssignment.findMany as jest.Mock).mockResolvedValueOnce(
      fixtureAssignmentsData
    );

    const result = await getAllFixtureAssignments();

    expect(result).toEqual(fixtureAssignmentsData);
    expect(prismaMock.fixtureAssignment.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.fixtureAssignment.findMany).toHaveBeenCalledWith({
      include: {},
    });
  });

  test('deleteFixtureAssignment', async () => {
    const assignmentId = 1;

    (prismaMock.fixtureAssignment.delete as jest.Mock).mockResolvedValueOnce({
      id: assignmentId,
    });

    const result = await deleteFixtureAssignment(assignmentId);

    expect(result).toEqual({ id: assignmentId });
    expect(prismaMock.fixtureAssignment.delete).toHaveBeenCalledWith({
      where: { id: assignmentId },
    });
  });
});

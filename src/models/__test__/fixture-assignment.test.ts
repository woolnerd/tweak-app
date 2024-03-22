import FixtureAssignment from '../fixture-assignment';
import {
  Prisma,
  FixtureAssignment as FixtureAssignmentType,
} from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma';

describe('Fixture Assignment Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new fixture assignment', async () => {
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

    const result = await new FixtureAssignment().create(fixtureAssignmentData);
    expect(prismaMock.fixtureAssignment.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fixtureAssignmentData);
    expect(prismaMock.fixtureAssignment.create).toHaveBeenCalledWith({
      data: fixtureAssignmentData,
    });
  });

  test('should get all fixture assignments', async () => {
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

    const result = await new FixtureAssignment().getAll();

    expect(result).toEqual(fixtureAssignmentsData);
    expect(prismaMock.fixtureAssignment.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.fixtureAssignment.findMany).toHaveBeenCalledWith({
      include: { fixture: false, scenes: false, profile: false },
    });
  });

  test("should get fixture assignment by it's id", async () => {
    const fixtureAssignment: FixtureAssignmentType = {
      id: 1,
      title: 'Test Fixture Assignment',
      channel: 10,
      value: 255,
      fixtureId: 1,
      profileId: 1,
    };

    prismaMock.fixtureAssignment.findUnique.mockResolvedValue(
      fixtureAssignment
    );

    await expect(
      new FixtureAssignment().getById(fixtureAssignment.id)
    ).resolves.toEqual(fixtureAssignment);
  });

  test('should update a fixture assignment', async () => {
    const fixtureAssignment: FixtureAssignmentType = {
      id: 1,
      title: 'Test Fixture Assignment',
      channel: 10,
      value: 255,
      fixtureId: 1,
      profileId: 1,
    };

    prismaMock.fixtureAssignment.update.mockResolvedValue(fixtureAssignment);

    await expect(
      new FixtureAssignment().update(fixtureAssignment)
    ).resolves.toEqual({
      id: 1,
      title: 'Test Fixture Assignment',
      channel: 10,
      value: 255,
      fixtureId: 1,
      profileId: 1,
    });

    expect(prismaMock.fixtureAssignment.update).toHaveBeenCalledTimes(1);
  });

  test('deleteFixtureAssignment', async () => {
    const assignmentId = 1;

    (prismaMock.fixtureAssignment.delete as jest.Mock).mockResolvedValueOnce({
      id: assignmentId,
    });

    const result = await new FixtureAssignment().delete(assignmentId);

    expect(result).toEqual({ id: assignmentId });
    expect(prismaMock.fixtureAssignment.delete).toHaveBeenCalledWith({
      where: { id: assignmentId },
    });
  });
});

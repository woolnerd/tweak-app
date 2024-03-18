// import { Profile, Fixture } from '@prisma/client';
// import { fixtureAssignmentMock } from '@/__mocks__/@prisma/client';
// import {
//   FixtureAssignment,
//   createFixtureAssignment,
//   deleteFixtureAssignment,
//   getAllFixtureAssignments,
// } from '../../models/fixture-assignment';
// import { PrismaClient } from '@/__mocks__/@prisma/client';

// describe('Fixture Assignment Model', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('createFixtureAssignment', async () => {
//     const mockFixture: Fixture = {
//       id: 1,
//       name: 'Test Fixture',
//       notes: 'Test notes',
//       assigned: false,
//       manufacturerId: 1,
//     };

//     const mockProfile: Profile = {
//       id: 1,
//       name: 'mode 6',
//       channels: JSON.stringify({
//         1: 'Red',
//         2: 'Green',
//         3: 'Blue',
//         4: 'Intensity',
//       }),
//     };

//     const mockAssignment: FixtureAssignment = {
//       title: 'Test 1',
//       channel: 10,
//       value: 255,
//       fixtureId: mockFixture.id,
//       profileId: mockProfile.id,
//     };

//     const mockPrismaClient = PrismaClient.getMockImplementation.
//     fixtureAssignmentMock.mockResolvedValue(mockAssignment);

//     const result = await createFixtureAssignment(mockAssignment);

//     expect(result).toEqual(mockAssignment);
//     expect(fixtureAssignmentMock).toHaveBeenCalledWith({
//       data: {
//         title: 'Test 1',
//         channel: 10,
//         value: 255,
//         fixtureId: 1,
//         profileId: 1,
//       },
//     });
//   });

//   test('delete fixture assignment', async () => {
//     const mockAssignment: FixtureAssignment = {
//       title: 'Test 1',
//       channel: 10,
//       value: 255,
//       fixtureId: 1,
//       profileId: 1,
//     };

//     fixtureAssignmentMock.mockResolvedValue(mockAssignment);

//     let result = await createFixtureAssignment(mockAssignment);
//     expect(result).toEqual(mockAssignment);

//     let results = await getAllFixtureAssignments();
//     console.log(results);

//     // expect(results)
//     result = await deleteFixtureAssignment(result.id);
//     results = await getAllFixtureAssignments();
//     // expect(results.length).toBe(0);
//     console.log(results);

//     expect(fixtureAssignmentMock).toHaveBeenCalledWith(fixtureAssignmentMock);
//     expect(result).toMatchObject({});
//   });
// });

import {
  createFixtureAssignment,
  getAllFixtureAssignments,
  deleteFixtureAssignment,
} from '../fixture-assignment';
import { PrismaClient } from '@prisma/client';

// Mocking PrismaClient
const prismaMock = new PrismaClient();

// Mocking PrismaClient's methods
// prismaMock.fixtureAssignment.create = jest.fn();
// prismaMock.fixtureAssignment.findMany = jest.fn();
// prismaMock.fixtureAssignment.delete = jest.fn();

describe('Fixture Assignment Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createFixtureAssignment', async () => {
    const fixtureAssignmentData = {
      data: {
        title: 'Test Assignment',
        channel: 1,
        value: 50,
        fixtureId: 1,
        profileId: 1,
      },
    };

    // Mocking the PrismaClient's fixtureAssignment.create method
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

    // Mocking the PrismaClient's fixtureAssignment.findMany method
    (prismaMock.fixtureAssignment.findMany as jest.Mock).mockResolvedValueOnce(
      fixtureAssignmentsData
    );

    const result = await getAllFixtureAssignments();

    expect(result).toEqual(fixtureAssignmentsData);
    expect(prismaMock.fixtureAssignment.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.fixtureAssignment.findMany).toHaveBeenCalledWith();
  });

  test('deleteFixtureAssignment', async () => {
    const assignmentId = 1;

    // Mocking the PrismaClient's fixtureAssignment.delete method
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

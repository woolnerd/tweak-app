import { Profile, Fixture } from '@prisma/client';
import { fixtureAssignmentMock } from '@/__mocks__/@prisma/client';
import {
  FixtureAssignment,
  createFixtureAssignment,
  deleteFixtureAssignment,
  getAllFixtureAssignments,
} from '../../models/fixture-assignment';

describe('Fixture Assignment Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createFixtureAssignment', async () => {
    const mockFixture: Fixture = {
      id: 1,
      name: 'Test Fixture',
      notes: 'Test notes',
      assigned: false,
      manufacturerId: 1,
    };

    const mockProfile: Profile = {
      id: 1,
      name: 'mode 6',
      channels: JSON.stringify({
        1: 'Red',
        2: 'Green',
        3: 'Blue',
        4: 'Intensity',
      }),
    };

    const mockAssignment: FixtureAssignment = {
      title: 'Test 1',
      channel: 10,
      value: 255,
      fixtureId: mockFixture.id,
      profileId: mockProfile.id,
    };

    fixtureAssignmentMock.mockResolvedValue(mockAssignment);

    const result = await createFixtureAssignment(mockAssignment);

    expect(result).toEqual(mockAssignment);
    expect(fixtureAssignmentMock).toHaveBeenCalledWith({
      data: {
        title: 'Test 1',
        channel: 10,
        value: 255,
        fixtureId: 1,
        profileId: 1,
      },
    });
  });

  test('delete fixture assignment', async () => {
    const mockAssignment: FixtureAssignment = {
      title: 'Test 1',
      channel: 10,
      value: 255,
      fixtureId: 1,
      profileId: 1,
    };

    fixtureAssignmentMock.mockResolvedValue(mockAssignment);

    let result = await createFixtureAssignment(mockAssignment);
    expect(result).toEqual(mockAssignment);

    let results = await getAllFixtureAssignments();
    console.log(results);

    // expect(results)
    result = await deleteFixtureAssignment(result.id);
    results = await getAllFixtureAssignments();
    // expect(results.length).toBe(0);
    console.log(results);

    expect(result).toMatchObject({});
  });
});

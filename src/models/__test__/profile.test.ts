import {
  createProfile,
  deleteProfile,
  getAllProfiles,
  getProfile,
  updateProfile,
} from '../profile';
import { Prisma, Profile } from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma';

const channels = JSON.stringify({ 1: 'Red', 2: 'Green', 3: 'Blue' });

const mockProfile: Profile = {
  id: 1,
  name: 'Test Profile',
  channels,
};

describe('Profile model', () => {
  test('should create a new profile', async () => {
    const profile: Prisma.ProfileCreateInput = {
      name: 'Test Profile',
      channels,
      profilesOnFixtures: {
        connect: { fixtureId_profileId: { fixtureId: 1, profileId: 1 } },
      },
      patches: {
        connect: { id: 1 },
      },
      fixtureAssignments: {
        connect: { id: 1 },
      },
    };

    prismaMock.profile.create.mockResolvedValue(mockProfile);
    await expect(createProfile(profile)).resolves.toEqual(mockProfile);
    expect(prismaMock.profile.create).toHaveBeenCalledTimes(1);
  });

  test("should get profile by it's id", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);

    await expect(getProfile(mockProfile.id)).resolves.toEqual(mockProfile);
  });

  test('should find all profiles', async () => {
    const mockProfiles = [
      {
        id: 1,
        name: 'Test Profile1',
        channels,
      },
      {
        id: 2,
        name: 'Test Profile2',
        channels,
      },
    ];

    prismaMock.profile.findMany.mockResolvedValue(mockProfiles);

    await expect(getAllProfiles()).resolves.toHaveLength(2);
    await expect(getAllProfiles()).resolves.toBe(mockProfiles);
  });

  test('should update a profile', async () => {
    prismaMock.profile.update.mockResolvedValue(mockProfile);

    await expect(updateProfile(mockProfile)).resolves.toEqual({
      id: 1,
      name: 'Test Profile',
      channels,
    });

    expect(prismaMock.profile.update).toHaveBeenCalledTimes(1);
  });

  test('should delete a profile', async () => {
    prismaMock.profile.delete.mockResolvedValue(mockProfile);

    await expect(deleteProfile(1)).resolves.toEqual(mockProfile);
  });
});

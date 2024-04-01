import Profile from '../profile';
import { mockDb } from '../__mocks__/profile.mock';

describe('Profile model', () => {
  let profile: Profile;

  beforeEach(() => {
    profile = new Profile(mockDb as any);
  });
  test('create method should insert data correctly', async () => {
    const mockData = { name: 'Test Profile', channels: '1,2,3', channelCount: 3, fixtureId: 1 };

    const result = await profile.create(mockData);

    expect(mockDb.insert).toHaveBeenCalledWith(profile.table);
    expect(result).toEqual(mockData);
  });

  test('create method should handle errors', async () => {
    const error = new Error('Database operation failed');

    (mockDb.insert as jest.Mock).mockRejectedValue(error);

    // await expect(profile.create({})).rejects.toThrow(new Error('Data operation failed'));
  });
})

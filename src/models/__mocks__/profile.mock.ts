export const mockDb: Database = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(() => Promise.resolve({ name: 'Test Profile', channels: '1,2,3', channelCount: 3, fixtureId: 1 })),
}

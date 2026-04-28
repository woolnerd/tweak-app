export const openDatabaseSync = jest.fn(() => ({
  execAsync: jest.fn(),
  runAsync: jest.fn(),
  getAllAsync: jest.fn(() => Promise.resolve([])),
  getFirstAsync: jest.fn(() => Promise.resolve(null)),
  closeAsync: jest.fn(),
  prepareAsync: jest.fn(),
  transaction: jest.fn(),
}));

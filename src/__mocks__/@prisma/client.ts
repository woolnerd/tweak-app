const mock = jest.fn();

export const PrismaClient = jest.fn().mockImplementation(() => ({
  fixture: {
    create: mock,
  },
  fixtureAssignment: {
    create: mock,
    delete: mock,
    findMany: mock,
  },
  manufacturer: {
    create: mock,
    findMany: mock,
  },
}));

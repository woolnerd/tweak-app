// __mocks__/@prisma/client.ts

export const fixtureCreateMock = jest.fn();

export const PrismaClient = jest.fn().mockImplementation(() => ({
  fixture: {
    create: fixtureCreateMock,
  },
}));

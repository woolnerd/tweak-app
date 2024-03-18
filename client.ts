export const fixtureCreateMock = jest.fn();
export const fixtureAssignmentMock = jest.fn();

export const PrismaClient = jest.fn().mockImplementation(() => ({
  fixture: {
    create: fixtureCreateMock,
  },
  fixtureAssignment: {
    create: fixtureAssignmentMock,
    delete: fixtureAssignmentMock,
    findMany: fixtureAssignmentMock,
  },
}));

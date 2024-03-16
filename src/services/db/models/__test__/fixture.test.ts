import { createFixture } from '../fixture';
import { Fixture } from '@prisma/client';
import { fixtureCreateMock } from '@/__mocks__/@prisma/client';

describe('Fixture Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createFixture', async () => {
    const mockFixture: Fixture = {
      id: 1,
      name: 'Test Fixture',
      notes: 'Test notes',
      assigned: false,
      manufacturerId: 1,
    };
    fixtureCreateMock.mockResolvedValue(mockFixture);

    const result = await createFixture('Test Fixture', 'Test notes', 1);

    expect(result).toEqual(mockFixture);
    expect(fixtureCreateMock).toHaveBeenCalledWith({
      data: {
        name: 'Test Fixture',
        notes: 'Test notes',
        manufacturerId: 1,
      },
    });
  });
});

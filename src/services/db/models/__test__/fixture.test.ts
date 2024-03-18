import { createFixture, deleteFixture, updateFixture } from '../fixture';
import { Prisma } from '@prisma/client';
import { prismaMock, mockFixture } from '@/__mocks__/prisma-mock';
import prisma from '@/lib/prisma';

describe('Fixture model', () => {
  test('should create a new fixture', async () => {
    const fixture: Prisma.FixtureCreateInput = {
      name: 'Test Fixture',
      notes: 'Test notes',
      manufacturer: {
        connect: { id: 1 },
      },
    };

    prismaMock.fixture.create.mockResolvedValue(mockFixture);
    const result = await createFixture(fixture, 1); //second arg is not implemented by test

    // const _test = {...fixture, data: {manufacturer: {connect: }}}

    expect(result.name).toEqual(fixture.name);
    expect(result.notes).toEqual(fixture.notes);
    expect(result.manufacturerId).toEqual(fixture.manufacturer?.connect?.id);
    expect(prismaMock.fixture.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.fixture.create).toHaveBeenCalledWith(fixture, 1);
  });

  test('should update a fixture', async () => {
    prismaMock.fixture.update.mockResolvedValue(mockFixture);

    const result = await updateFixture(1, { assigned: true });
    // expect(result.assigned).toEqual(true);

    const _test = {
      ...Object.create(result),
      data: { assigned: true },
      where: { id: 1 },
    };

    expect(prismaMock.fixture.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.fixture.update).toHaveBeenCalledWith(_test);
  });

  test('should delete a fixture', async () => {
    prismaMock.fixture.delete.mockResolvedValue(mockFixture);

    await expect(deleteFixture(1)).resolves.toEqual(mockFixture);
  });
});

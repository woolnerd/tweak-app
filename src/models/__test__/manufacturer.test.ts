import { createManufacturer, getAllManufacturers } from '../manufacturer';
import { Manufacturer, Prisma } from '@prisma/client';
import { prismaMock } from '@/__mocks__/@prisma/prisma-mock';

describe('Manufacturer model', () => {
  test('creates a manufacturer', async () => {
    const manufacturer = {
      id: 1,
      name: 'Arri',
      website: 'www.arri.com',
      notes: 'Test notes',
    };

    prismaMock.manufacturer.create.mockResolvedValue(manufacturer);

    await expect(createManufacturer(manufacturer)).resolves.toEqual({
      id: 1,
      name: 'Arri',
      website: 'www.arri.com',
      notes: 'Test notes',
    });
  });

  test('getAllManufacturers should accept options', async () => {
    const manufacturers = [
      {
        id: 1,
        name: 'Arri',
        website: 'www.arri.com',
        notes: 'Test notes',
      },
      {
        id: 2,
        name: 'Astera',
        website: 'www.astera.com',
        notes: 'Test notes2',
      },
    ];

    prismaMock.manufacturer.findMany.mockResolvedValue(manufacturers);

    await expect(getAllManufacturers({ fixtures: true })).resolves.toEqual(
      manufacturers
    );

    expect(prismaMock.manufacturer.findMany).toHaveBeenCalledWith({
      include: { fixtures: true },
    });

    await expect(getAllManufacturers()).resolves.toEqual(manufacturers);

    expect(prismaMock.manufacturer.findMany).toHaveBeenCalledWith({
      include: {},
    });
  });
});

import { createManufacturer, getAllManufacturers } from '../manufacturer';
import { Manufacturer, Prisma } from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma-mock';

describe('Manufacturer model', () => {
  test('creates a manufacturer', async () => {
    const manufacturer = {
      id: 1,
      name: 'Arri',
      website: 'www.arri.com',
      notes: 'Test notes',
    };

    prismaMock.manufacturer.create.mockResolvedValue(manufacturer);

    await expect(createManufacturer(manufacturer)).resolves.toBe({
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
        notes: null,
      },
    ];

    prismaMock.manufacturer.findMany.mockResolvedValue(manufacturers);

    await expect(getAllManufacturers()).resolves.toBe(manufacturers);
  });
});

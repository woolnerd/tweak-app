import Manufacturer from '../manufacturer';
import { Manufacturer as ManufacturerType } from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma';

describe('Manufacturer model', () => {
  test('creates a manufacturer', async () => {
    const manufacturer: ManufacturerType = {
      id: 1,
      name: 'Arri',
      website: 'www.arri.com',
      notes: 'Test notes',
    };

    prismaMock.manufacturer.create.mockResolvedValue(manufacturer);

    await expect(new Manufacturer().create(manufacturer)).resolves.toEqual({
      id: 1,
      name: 'Arri',
      website: 'www.arri.com',
      notes: 'Test notes',
    });
  });

  test('getAllManufacturers should accept options', async () => {
    const manufacturers: ManufacturerType[] = [
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

    await expect(new Manufacturer().getAll()).resolves.toEqual(manufacturers);

    expect(prismaMock.manufacturer.findMany).toHaveBeenCalledWith({
      include: { fixtures: true },
    });

    await expect(
      new Manufacturer().getAll({ select: { name: true } })
    ).resolves.toEqual(manufacturers);

    expect(prismaMock.manufacturer.findMany).toHaveBeenCalledWith({
      select: { name: true },
    });
  });
});

import { Manufacturer, Prisma } from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma';

interface GetAllOptions {
  fixtures?: boolean;
}

export async function createManufacturer(
  manufacturer: Prisma.ManufacturerCreateInput
) {
  return await prismaMock.manufacturer.create({ data: manufacturer });
}

export async function getAllManufacturers(options: GetAllOptions = {}) {
  return await prismaMock.manufacturer.findMany({ include: options });
}

export async function getManufacturer(manufacturerId: number) {
  return await prismaMock.manufacturer.findUnique({
    where: { id: manufacturerId },
  });
}

export async function updateManufacturer(manufacturer: Manufacturer) {
  return await prismaMock.manufacturer.update({
    where: { id: manufacturer.id },
    data: manufacturer,
  });
}

export async function deleteManufacturer(manufacturerId: number) {
  return await prismaMock.manufacturer.delete({
    where: { id: manufacturerId },
  });
}

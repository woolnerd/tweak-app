import { PrismaClient, Manufacturer, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

interface GetAllOptions {
  fixtures?: boolean;
}

export async function createManufacturer(
  manufacturer: Prisma.ManufacturerCreateInput
) {
  return await prisma.manufacturer.create({ data: manufacturer });
}

export async function getAllManufacturers(options: GetAllOptions = {}) {
  return await prisma.manufacturer.findMany({ include: options });
}

export async function getManufacturer(manufacturerId: number) {
  return await prisma.manufacturer.findUnique({
    where: { id: manufacturerId },
  });
}

export async function updateManufacturer(manufacturer: Manufacturer) {
  return await prisma.manufacturer.update({
    where: { id: manufacturer.id },
    data: manufacturer,
  });
}

export async function deleteManufacturer(manufacturerId: number) {
  return await prisma.manufacturer.delete({ where: { id: manufacturerId } });
}

import { Manufacturer as ManufacturerType, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import Base from './base';

export default class Manufacturer extends Base<
  Prisma.ManufacturerCreateInput,
  ManufacturerType
> {
  readonly prisma = prisma.manufacturer;
  private DEFAULT_OPTIONS: Prisma.ManufacturerFindManyArgs = {
    include: { fixtures: true },
  };

  async getAll(inputOptions: Prisma.ManufacturerFindManyArgs = {}) {
    const options =
      Object.keys(inputOptions).length > 0
        ? inputOptions
        : this.DEFAULT_OPTIONS;

    return await prisma.manufacturer.findMany(options);
  }
}

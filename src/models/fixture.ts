import { Prisma, Fixture as FixtureType } from '@prisma/client';
import prisma from '@/lib/prisma';
import Base from './base';

export default class Fixture extends Base<
  Prisma.FixtureCreateInput,
  FixtureType
> {
  readonly prisma = prisma.fixture;
  async create(
    fixture: Prisma.FixtureCreateInput,
    { manufacturerId }: { manufacturerId: number }
  ) {
    return await prisma.fixture.create({
      data: {
        ...fixture,
        manufacturer: {
          connect: { id: manufacturerId },
        },
      },
    });
  }
}

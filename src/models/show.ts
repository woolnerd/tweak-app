import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import Base from './base';

export class ShowModel extends Base<Prisma.ShowCreateInput> {
  prisma = prisma.show;
}

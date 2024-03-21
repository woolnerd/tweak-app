import { Prisma, Show as ShowType } from '@prisma/client';
import prisma from '@/lib/prisma';
import Base from './base';

export default class Show extends Base<Prisma.ShowCreateInput, ShowType> {
  prisma = prisma.show;
}

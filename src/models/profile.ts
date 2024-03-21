import { Prisma, Profile as ProfileType } from '@prisma/client';
import prisma from '@/lib/prisma';
import Base from './base';

export default class Profile extends Base<
  Prisma.ProfileCreateInput,
  ProfileType
> {
  prisma = prisma.profile;
}

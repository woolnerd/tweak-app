import { Prisma, Profile } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function createProfile(profile: Prisma.ProfileCreateInput) {
  return await prisma.profile.create({
    data: profile,
  });
}

export async function getAllProfiles() {
  return await prisma.profile.findMany();
}

export async function getProfile(profileId: number) {
  return await prisma.profile.findUnique({ where: { id: profileId } });
}

export async function updateProfile(profile: Profile) {
  return await prisma.profile.update({
    where: { id: profile.id },
    data: profile,
  });
}

export async function deleteProfile(profileId: number) {
  return await prisma.profile.delete({
    where: { id: profileId },
  });
}

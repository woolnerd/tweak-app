import { Prisma, Scene, SceneList } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function createScene(scene: Prisma.SceneCreateInput) {
  return await prisma.scene.create({
    data: scene,
  });
}

export async function getAllScenes() {
  return await prisma.scene.findMany({ orderBy: { orderNumber: 'asc' } });
}

export async function getScene(sceneId: number) {
  return await prisma.scene.findUnique({ where: { id: sceneId } });
}

export async function updateScene(scene: Scene) {
  return await prisma.scene.update({
    where: { id: scene.id },
    data: scene,
  });
}

export async function deleteScene(sceneId: number) {
  return await prisma.scene.delete({
    where: { id: sceneId },
  });
}

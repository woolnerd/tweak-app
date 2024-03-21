import { Prisma, Scene as SceneType } from '@prisma/client';
import prisma from '@/lib/prisma';
import Base from './base';

export default class Scene extends Base<Prisma.SceneCreateInput, SceneType> {
  readonly prisma = prisma.scene;

  constructor() {
    super();
  }

  async getAll(options: Prisma.SceneFindManyArgs = {}): Promise<SceneType[]> {
    Object.keys(options).length > 0
      ? options
      : { orderBy: { orderNumber: 'asc' } };
    return await prisma.scene.findMany(options);
  }
}

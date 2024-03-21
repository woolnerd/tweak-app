import { Prisma, Scene as SceneType } from '@prisma/client';
import prisma from '@/lib/prisma';
import Base from './base';

export default class Scene extends Base<Prisma.SceneCreateInput, SceneType> {
  prisma = prisma.scene;
  public getAllOptions: Prisma.SceneFindManyArgs;

  constructor(getAllOptions = {}) {
    super();
    this.getAllOptions =
      Object.keys(getAllOptions).length > 0
        ? getAllOptions
        : { orderBy: { orderNumber: 'asc' } };
  }

  async getAll(options = this.getAllOptions): Promise<SceneType[]> {
    return await prisma.scene.findMany(options);
  }
}

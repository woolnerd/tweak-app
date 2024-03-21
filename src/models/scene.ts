import { Prisma, Scene } from '@prisma/client';
import prisma from '@/lib/prisma';
import Base from './base';

export class SceneModel extends Base<Prisma.SceneCreateInput, Scene> {
  prisma = prisma.scene;
  public getAllOptions: Prisma.SceneFindManyArgs;

  constructor(getAllOptions = {}) {
    super();
    this.getAllOptions =
      Object.keys(getAllOptions).length > 0
        ? getAllOptions
        : { orderBy: { orderNumber: 'asc' } };
  }

  async getAll(options = this.getAllOptions): Promise<Scene[]> {
    return await prisma.scene.findMany(options);
  }
}

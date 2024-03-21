import { Prisma } from '@prisma/client';

export default abstract class Base<T, K extends { id: number }> {
  abstract readonly prisma: any;

  async create(data: T, options?: {}): Promise<K> {
    return await this.prisma.create({ data });
  }

  async getAll(options?: {}): Promise<K[]> {
    return await this.prisma.findMany();
  }

  async getById(id: number): Promise<K> {
    return await this.prisma.findUnique({ where: { id } });
  }

  async update(data: K): Promise<K> {
    const { id, ...restData } = data;
    return await this.prisma.update({
      where: { id },
      data: restData,
    });
  }

  async delete(id: number): Promise<K> {
    return await this.prisma.delete({ where: { id } });
  }
}

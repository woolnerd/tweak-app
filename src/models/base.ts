export default abstract class Base<T, K> {
  protected abstract prisma: any;

  async create(data: T): Promise<K> {
    return await this.prisma.create({ data });
  }

  async getAll(): Promise<K[]> {
    return await this.prisma.findMany();
  }

  async getById(id: number): Promise<K> {
    return await this.prisma.findUnique({ where: { id } });
  }

  async update(data: T & { id: number }): Promise<K> {
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

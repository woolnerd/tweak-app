export default abstract class Base<T> {
  abstract prisma: any;

  async create(data: T) {
    return await this.prisma.create({ data });
  }

  async getAll() {
    return await this.prisma.findMany();
  }

  async getById(id: number) {
    return await this.prisma.findUnique({ where: { id } });
  }

  async update(data: T & { id: number }) {
    const { id, ...restData } = data;
    return await this.prisma.update({
      where: { id },
      data: restData,
    });
  }

  async delete(id: number) {
    return await this.prisma.delete({ where: { id } });
  }
}

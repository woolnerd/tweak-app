export default abstract class Base<T, K extends { id: number }> {
  abstract readonly database: any;

  async create(data: T, options?: {}): Promise<K> {
    return await this.database.create(data);
  }

  async getAll(options?: {}): Promise<K[]> {
    return await this.database.findMany();
  }

  async getById(id: number): Promise<K> {
    return await this.database.findUnique({ where: { id } });
  }

  async update(data: K): Promise<K> {
    const { id, ...restData } = data;
    return await this.database.update({
      where: { id },
      data: restData,
    });
  }

  async delete(id: number): Promise<K> {
    return await this.database.delete({ where: { id } });
  }
}

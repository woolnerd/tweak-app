import Base from './base';
import { manufacturers } from '@/db/schema';
import { Database } from '@/db/types/database';
import { InsertManufacturer, SelectManufacturer } from '@/db/types/tables';

export default class Manufacturer extends Base<
  InsertManufacturer,
  SelectManufacturer
> {
  readonly table = manufacturers;
  private DEFAULT_OPTIONS = {
    include: { fixtures: true },
  };

  constructor(db: Database) {
    super(db);
  }

  async getAll(inputOptions = {}) {
    const options =
      Object.keys(inputOptions).length > 0
        ? inputOptions
        : this.DEFAULT_OPTIONS;

    return await this.db.select().from(this.table);
  }
}

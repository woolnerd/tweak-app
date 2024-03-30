import Base from './base';
import { scenes } from '@/db/schema';
import { Database, QueryKeys } from '@/db/types/database';
import { InsertScene, SelectScene, TableNames } from '@/db/types/tables';
import { desc, asc, DBQueryConfig } from 'drizzle-orm';

export default class Scene extends Base<InsertScene, SelectScene> {
  readonly table = scenes
  readonly name: QueryKeys = TableNames.Scenes;

  constructor(db: Database) {
    super(db);
  }

  async getAllOrdered(options?: { desc: boolean }) {
    try {
      const func = options && options.desc ? desc : asc;
      return await this.db.select().from(this.table).orderBy(func(this.table.order));
    } catch (err) {
      this.handleError(err)
    }
  }
}

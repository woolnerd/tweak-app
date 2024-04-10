import { desc, asc } from "drizzle-orm";

import Base from "./base.ts";
import { scenes } from "../db/schema.ts";
import { QueryKeys } from "../db/types/database.ts";
import { SelectScene, TableNames } from "../db/types/tables.ts";

export default class Scene extends Base<typeof scenes, SelectScene> {
  readonly table = scenes;

  readonly name: QueryKeys = TableNames.Scenes;

  async getAllOrdered(options?: { desc: boolean }) {
    try {
      const func = options && options.desc ? desc : asc;
      return await this.db
        .select()
        .from(this.table)
        .orderBy(func(this.table.order));
    } catch (err) {
      return this.handleError(err);
    }
  }
}

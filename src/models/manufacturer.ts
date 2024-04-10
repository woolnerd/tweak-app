import Base from "./base";

import { manufacturers } from "@/db/schema";
import { Database, QueryKeys } from "@/db/types/database";
import { SelectManufacturer, TableNames } from "@/db/types/tables";

export default class Manufacturer extends Base<typeof manufacturers, SelectManufacturer> {
  readonly table = manufacturers;
  readonly name: QueryKeys = TableNames.Manufacturers;

  constructor(db: Database) {
    super(db);
  }
}

import { eq } from "drizzle-orm";

import Base from "./base.ts";
import { manufacturers } from "../db/schema.ts";
import { QueryKeys } from "../db/types/database.ts";
import { SelectManufacturer, TableNames } from "../db/types/tables.ts";

export default class Manufacturer extends Base<
  typeof manufacturers,
  SelectManufacturer
> {
  readonly table = manufacturers;

  readonly name: QueryKeys = TableNames.Manufacturers;
}

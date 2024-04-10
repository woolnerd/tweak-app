import Base from "./base.ts";
import { shows } from "../db/schema.ts";
import { QueryKeys } from "../db/types/database.ts";
import { SelectShow, TableNames } from "../db/types/tables.ts";

export default class Show extends Base<typeof shows, SelectShow> {
  readonly table = shows;

  readonly name: QueryKeys = TableNames.Shows;
}

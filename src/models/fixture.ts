import Base from "./base.ts";
import { fixtures } from "../db/schema.ts";
import { QueryKeys } from "../db/types/database.ts";
import { SelectFixture, TableNames } from "../db/types/tables.ts";

export default class Fixture extends Base<typeof fixtures, SelectFixture> {
  readonly table = fixtures;

  readonly name: QueryKeys = TableNames.Fixtures;
}

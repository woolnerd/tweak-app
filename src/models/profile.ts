import Base from "./base.ts";
import { profiles } from "../db/schema.ts";
import { QueryKeys } from "../db/types/database.ts";
import { SelectProfile, TableNames } from "../db/types/tables.ts";

export default class Profile extends Base<typeof profiles, SelectProfile> {
  readonly table = profiles;

  readonly name: QueryKeys = TableNames.Profiles;
}

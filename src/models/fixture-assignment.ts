import Base from "./base.ts";
import { fixtureAssignments } from "../db/schema.ts";
import { QueryKeys } from "../db/types/database.ts";
import { SelectFixtureAssignment, TableNames } from "../db/types/tables.ts";

export default class FixtureAssignment extends Base<
  typeof fixtureAssignments,
  SelectFixtureAssignment
> {
  readonly table = fixtureAssignments;

  readonly name: QueryKeys = TableNames.FixtureAssignments;
}

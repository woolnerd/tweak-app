import { eq } from "drizzle-orm";

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

  protected stringifyFieldsFromJSON: (
    data: SelectFixtureAssignment,
  ) => SelectFixtureAssignment;

  async update({
    id,
    ...restData
  }: SelectFixtureAssignment): Promise<SelectFixtureAssignment[] | void> {
    restData = FixtureAssignment.stringifyFieldsFromJSON({ id, ...restData });

    try {
      return await this.db
        .update(this.table)
        .set(restData)
        .where(eq(this.table.id, id))
        .returning();
    } catch (err) {
      return this.handleError(err);
    }
  }

  static stringifyFieldsFromJSON(data: SelectFixtureAssignment) {
    data.values = JSON.stringify(data.values);
    return data;
  }
}

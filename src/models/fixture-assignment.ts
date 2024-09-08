import { eq } from "drizzle-orm";

import Base from "./base.ts";
import { ManualFixtureState } from "../app/components/Fixture/types/Fixture.ts";
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

  // async batchUpdate<T extends ManualFixtureState>(fixtureArray: T[]) {
  //   try {
  //     return await this.db.transaction(async (tx) =>
  //       Promise.all(
  //         fixtureArray.map((fixture: T) =>
  //           tx
  //             .update(fixtureAssignments)
  //             .set({
  //               values:
  //                 FixtureAssignment.stringifyFieldsFromJSON(fixture).values,
  //             })
  //             .where(eq(fixtureAssignments.id, fixture.fixtureAssignmentId))
  //             .returning(),
  //         ),
  //       ),
  //     );
  //   } catch (err) {
  //     return this.handleError(err);
  //   }
  // }

  // static stringifyFieldsFromJSON(data: { values: number[][] }): {
  //   values: string;
  // } {
  //   const vals = { values: JSON.stringify(data.values) };
  //   return { ...data, ...vals };
  // }
}

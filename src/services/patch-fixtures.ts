import { fixtureAssignments } from "../db/schema.ts";
import { Database } from "../db/types/database.ts";
import { InsertPatch } from "../db/types/tables.ts";
import PatchModel from "../models/patch.ts";
import handleDatabaseError from "../util/errors.ts";

type PatchCreationObjects = (InsertPatch & {
  channelNum: number;
  endAddress: number;
})[];

export default class PatchFixtures {
  protected db: Database;

  protected handleError: (error: unknown) => void;

  constructor(db: Database) {
    this.db = db;
    this.handleError = handleDatabaseError;
  }

  async create(payLoadWithAddresses: PatchCreationObjects) {
    try {
      const promises = payLoadWithAddresses.map((patchPayload) =>
        new PatchModel(this.db).create(patchPayload),
      );

      const patchResponses = await Promise.all(promises);

      const fixtureAssignmentPromises = patchResponses.map((patchRes) => {
        const channel = payLoadWithAddresses.filter(
          (payload) => payload.startAddress === patchRes[0].startAddress,
        )[0].channelNum;
        return this.db.transaction(async (tx) =>
          tx
            .insert(fixtureAssignments)
            // returning() method from Drizzle returns an array of 1 object, AFAIK
            .values({
              channel,
              fixtureId: patchRes[0].fixtureId,
              profileId: patchRes[0].profileId,
              patchId: patchRes[0].id,
            })
            .returning({ id: fixtureAssignments.id }),
        );
      });

      return await Promise.all(fixtureAssignmentPromises);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

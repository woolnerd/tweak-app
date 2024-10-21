import { eq, sql } from "drizzle-orm";

import { FixtureDataForPatch } from "../app/patch/types/index.ts";
import {
  fixtureAssignments,
  fixtures,
  profiles,
  manufacturers,
  patches,
} from "../db/schema.ts";
import { Database } from "../db/types/database.ts";
import { InsertPatch } from "../db/types/tables.ts";
import PatchModel from "../models/patch.ts";
import handleDatabaseError from "../util/errors.ts";

type PatchCreationObjects = (InsertPatch & {
  channel: number;
  endAddress: number;
})[];

const OFFSET_BY_ONE = 1;

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
        const { channel } = payLoadWithAddresses.filter(
          (payload) => payload.startAddress === patchRes[0].startAddress,
        )[0];
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

  getFixtureDataForPatch = async (): Promise<FixtureDataForPatch[] | void> => {
    try {
      return await this.db
        .select({
          channel: fixtureAssignments.channel,
          profileName: profiles.name,
          fixtureName: fixtures.name,
          manufacturerName: manufacturers.name,
          startAddress: patches.startAddress,
          endAddress: sql<number>`${patches.startAddress} + (
            SELECT COUNT(*) AS channelCount
            FROM json_each(${profiles.channels})
          ) - ${OFFSET_BY_ONE}`,
        })
        .from(fixtureAssignments)
        .innerJoin(fixtures, eq(fixtureAssignments.fixtureId, fixtures.id))
        .innerJoin(profiles, eq(fixtureAssignments.profileId, profiles.id))
        .innerJoin(patches, eq(fixtureAssignments.patchId, patches.id))
        .innerJoin(
          manufacturers,
          eq(fixtures.manufacturerId, manufacturers.id),
        );
    } catch (error) {
      return this.handleError(error);
    }
  };
}

import { scenesToFixtureAssignments } from "../db/schema.ts";
import { Database } from "../db/types/database.ts";
import handleDatabaseError from "../util/errors.ts";

type FixtureAssignmentResponses = { id: number }[][];

export default class BatchCreateScenesToFixtureAssignments {
  protected db: Database;

  protected handleError: (error: unknown) => void;

  constructor(db: Database) {
    this.db = db;
    this.handleError = handleDatabaseError;
  }

  async create(
    fixtureAssignmentResponses: FixtureAssignmentResponses,
    sceneIds: number[],
  ) {
    try {
      await this.db.transaction(async (tx) => {
        const promises = sceneIds.map((sceneId: number) => {
          const fixturePromises = fixtureAssignmentResponses.map((response) =>
            tx
              .insert(scenesToFixtureAssignments)
              .values({
                sceneId,
                fixtureAssignmentId: response[0].id,
              })
              .returning(),
          );

          return Promise.all(fixturePromises);
        });
        await Promise.all(promises);
      });
      return "success";
    } catch (error) {
      return this.handleError(error);
    }
  }
}

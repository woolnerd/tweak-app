import { and, eq, notInArray } from "drizzle-orm";

import Base from "./base";

import {
  fixtures,
  fixtureAssignments,
  scenesToFixtureAssignments,
  profiles,
} from "@/db/schema";
import { Database, QueryKeys, MyQueryHelper } from "@/db/types/database";
import { SelectSceneToFixtureAssignment, TableNames } from "@/db/types/tables";

export default class ScenesToFixtureAssignments extends Base<
  typeof scenesToFixtureAssignments,
  SelectSceneToFixtureAssignment
> {
  readonly table = scenesToFixtureAssignments;
  readonly name: QueryKeys = TableNames.ScenesToFixtureAssignments;

  constructor(db: Database) {
    super(db);
  }

  async getFixturesAndAssignments(
    sceneId: number,
    selectedFixtureIds: Set<number>,
  ) {
    try {
      return await this.db
        .select({
          fixtureAssignmentId: fixtureAssignments.id,
          channel: fixtureAssignments.channel,
          values: fixtureAssignments.values,
          title: fixtureAssignments.title,
          profileChannels: profiles.channels,
          profileName: profiles.name,
          fixtureName: fixtures.name,
          fixtureNotes: fixtures.notes,
          sceneId: scenesToFixtureAssignments.sceneId,
        })
        .from(fixtureAssignments)
        .leftJoin(fixtures, eq(fixtures.id, fixtureAssignments.fixtureId))
        .leftJoin(
          scenesToFixtureAssignments,
          eq(
            fixtureAssignments.id,
            scenesToFixtureAssignments.fixtureAssignmentId,
          ),
        )
        .leftJoin(profiles, eq(fixtureAssignments.profileId, profiles.id))
        .where(
          and(
            eq(scenesToFixtureAssignments.sceneId, sceneId),
            // exclude any of the fixtures that are cached
            notInArray(fixtureAssignments.id, Array.from(selectedFixtureIds)),
          ),
        );
    } catch (err) {
      this.handleError(err);
    }
  }
}

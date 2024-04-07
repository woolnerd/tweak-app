import Base from './base';
import { fixtures, fixtureAssignments, scenes, scenesToFixtureAssignments, fixtureAssignmentRelations, profiles } from '@/db/schema';
import { Database, QueryKeys, MyQueryHelper } from '@/db/types/database';
import { SelectSceneToFixtureAssignment, TableNames } from '@/db/types/tables';
import { eq } from 'drizzle-orm';

export default class ScenesToFixtureAssignments extends Base<
  typeof scenesToFixtureAssignments,
  SelectSceneToFixtureAssignment
> {
  readonly table = scenesToFixtureAssignments;
  readonly name: QueryKeys = TableNames.ScenesToFixtureAssignments;

  constructor(db: Database) {
    super(db);
  }

  async getFixturesAndAssignments(sceneId: number) {
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
          sceneId: scenesToFixtureAssignments.sceneId
        })
        .from(fixtureAssignments)
        .leftJoin(fixtures, eq(fixtures.id, fixtureAssignments.fixtureId))
        .leftJoin(scenesToFixtureAssignments, eq(fixtureAssignments.id, scenesToFixtureAssignments.fixtureAssignmentId))
        .leftJoin(profiles, eq(fixtureAssignments.profileId, profiles.id))
        .where(eq(scenesToFixtureAssignments.sceneId, sceneId))

    } catch (err) {
      this.handleError(err);
    }
  }
 }

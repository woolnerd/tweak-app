import Base from './base';
import { fixtureAssignments, scenes, scenesToFixtureAssignments } from '@/db/schema';
import { Database, QueryKeys, MyQueryHelper } from '@/db/types/database';
import { SelectSceneToFixtureAssignment, TableNames } from '@/db/types/tables';

export default class ScenesToFixtureAssignments extends Base<
  typeof scenesToFixtureAssignments,
  SelectSceneToFixtureAssignment
> {
  readonly table = scenesToFixtureAssignments;
  readonly name: QueryKeys = TableNames.ScenesToFixtureAssignments;

  constructor(db: Database) {
    super(db);
  }

  async getFixtureAssignemntsBySceneNumber(sceneId: number) {
    try {
      return await this.db.query.scenesToFixtureAssignments.findMany({
        with: {
          fixtureAssignment: true
        },
        where: (scenesToFixtureAssignments, { eq }) => eq(scenesToFixtureAssignments.sceneId, sceneId),
      })
      // return await this.db.query.scenesToFixtureAssignments.findMany({
      //   where(fields, operators) {
      //       operators.eq(fields.sceneId, sceneId)
      //   },
      //   with: {
      //     fixtureAssignment: true,
      //     // fixture: true
      //   }
      // });
    } catch (err) {
      this.handleError(err);
    }
  }
 }

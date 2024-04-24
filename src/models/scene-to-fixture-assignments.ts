import { and, eq, notInArray } from "drizzle-orm";

import Base from "./base.ts";
import {
  ParsedCompositeFixtureInfo,
  UnparsedCompositeFixtureInfo,
} from "./types/scene-to-fixture-assignment.ts";
import {
  fixtures,
  fixtureAssignments,
  scenesToFixtureAssignments,
  profiles,
  patches,
} from "../db/schema.ts";
import { QueryKeys } from "../db/types/database.ts";
import {
  SelectSceneToFixtureAssignment,
  TableNames,
} from "../db/types/tables.ts";

export default class ScenesToFixtureAssignments extends Base<
  typeof scenesToFixtureAssignments,
  SelectSceneToFixtureAssignment
> {
  readonly table = scenesToFixtureAssignments;

  readonly name: QueryKeys = TableNames.ScenesToFixtureAssignments;

  private fetchedData: UnparsedCompositeFixtureInfo[];

  async getCompositeFixtureInfo(
    sceneId: number,
    selectedFixtureChannels: Set<number>,
  ) {
    try {
      this.fetchedData = await this.db
        .select({
          fixtureAssignmentId: fixtureAssignments.id,
          channel: fixtureAssignments.channel,
          values: fixtureAssignments.values,
          title: fixtureAssignments.title,
          profileChannels: profiles.channels,
          channelPairs16Bit: profiles.channelPairs16Bit,
          is16Bit: profiles.is16Bit,
          profileName: profiles.name,
          fixtureName: fixtures.name,
          fixtureNotes: fixtures.notes,
          sceneId: scenesToFixtureAssignments.sceneId,
          addressStart: patches.startAddress,
          addressEnd: patches.endAddress,
          colorTempLow: fixtures.colorTempRangeLow,
          colorTempHigh: fixtures.colorTempRangeHigh,
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
        .leftJoin(patches, eq(fixtureAssignments.patchId, patches.id))
        .where(
          // turn this checkoff while cache is being set aside for work later
          // and(
          eq(scenesToFixtureAssignments.sceneId, sceneId),
          // exclude any of the fixtures that are cached
          // notInArray(
          //   fixtureAssignments.channel,
          //   Array.from(selectedFixtureChannels),
          // ),
          // ),
        );

      return this.parseStringColumnsToJSON();
    } catch (err) {
      return this.handleError(err);
    }
  }

  private parseStringColumnsToJSON(): ParsedCompositeFixtureInfo[] {
    return this.fetchedData.map(
      (
        assignmentObj: UnparsedCompositeFixtureInfo,
      ): ParsedCompositeFixtureInfo => ({
        ...assignmentObj,
        values: assignmentObj.values ? JSON.parse(assignmentObj.values) : null,
        profileChannels: assignmentObj.profileChannels
          ? JSON.parse(assignmentObj.profileChannels)
          : null,
        channelPairs16Bit: assignmentObj
          ? JSON.parse(assignmentObj.channelPairs16Bit)
          : [],
      }),
    );
  }
}

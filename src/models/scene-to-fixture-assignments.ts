import { and, eq, notInArray, sql } from "drizzle-orm";

import Base from "./base.ts";
import {
  ParsedCompositeFixtureInfo,
  UnparsedCompositeFixtureInfo,
} from "./types/scene-to-fixture-assignment.ts";
import { ManualFixtureState } from "../app/components/Fixture/types/Fixture.ts";
import {
  fixtures,
  fixtureAssignments,
  scenesToFixtureAssignments,
  profiles,
  patches,
  manufacturers,
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

  private caldEndAddress: number;

  async getCompositeFixtureInfo(
    sceneId: number,
    selectedFixtureChannels: Set<number>,
  ) {
    try {
      this.fetchedData = (await this.db
        .select({
          fixtureAssignmentId: fixtureAssignments.id,
          channel: fixtureAssignments.channel,
          values: scenesToFixtureAssignments.values,
          profileChannels: profiles.channels,
          channelPairs16Bit: profiles.channelPairs16Bit,
          profileName: profiles.name,
          fixtureName: fixtures.name,
          fixtureNotes: fixtures.notes,
          sceneId: scenesToFixtureAssignments.sceneId,
          startAddress: patches.startAddress,
          colorTempLow: fixtures.colorTempRangeLow,
          colorTempHigh: fixtures.colorTempRangeHigh,
          manufacturerName: manufacturers.name,
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
        .leftJoin(manufacturers, eq(fixtures.manufacturerId, manufacturers.id))
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
        )) as UnparsedCompositeFixtureInfo[];

      return this.parseStringColumnsToJSON();
    } catch (err) {
      this.handleError(err);
      return [];
    }
  }

  async batchUpdate<T extends ManualFixtureState[number]>(
    fixtureArray: T[],
    sceneId: number,
  ) {
    try {
      return await this.db.transaction(async (tx) =>
        Promise.all(
          fixtureArray.map((fixture: T) =>
            tx
              .update(scenesToFixtureAssignments)
              .set({
                values:
                  ScenesToFixtureAssignments.stringifyFieldsFromJSON(fixture)
                    .values,
              })
              .where(
                and(
                  eq(
                    scenesToFixtureAssignments.fixtureAssignmentId,
                    fixture.fixtureAssignmentId,
                  ),
                  eq(scenesToFixtureAssignments.sceneId, sceneId),
                ),
              )
              .returning(),
          ),
        ),
      );
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
        values: assignmentObj.values ? JSON.parse(assignmentObj.values) : [],
        profileChannels: assignmentObj.profileChannels
          ? JSON.parse(assignmentObj.profileChannels)
          : [],
        channelPairs16Bit: JSON.parse(assignmentObj.channelPairs16Bit),
        is16Bit: JSON.parse(assignmentObj.channelPairs16Bit).length > 0,
        endAddress: ScenesToFixtureAssignments.calcEndAddress(assignmentObj),
      }),
    );
  }

  private static calcEndAddress(
    assignmentObj: UnparsedCompositeFixtureInfo,
  ): number {
    const profileChannels = JSON.parse(assignmentObj.profileChannels);
    return Object.keys(profileChannels).length > 0
      ? assignmentObj.startAddress + Object.keys(profileChannels).length - 1
      : assignmentObj.startAddress;
  }

  private static stringifyFieldsFromJSON(data: { values: number[][] }): {
    values: string;
  } {
    const vals = { values: JSON.stringify(data.values) };
    return { ...data, ...vals };
  }
}

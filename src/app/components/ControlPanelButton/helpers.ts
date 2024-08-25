import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";

export const profileSearch = (
  fixtures: ParsedCompositeFixtureInfo[],
  regExp: RegExp,
) =>
  fixtures.every((fixture) =>
    Object.values(fixture.profileChannels).find((profile: string) =>
      regExp.test(profile),
    ),
  );

export const selectionHasColorTemp = (fixtures: ParsedCompositeFixtureInfo[]) =>
  profileSearch(fixtures, /\b(color temp|cct)\b/i);

export const selectionHasTint = (fixtures: ParsedCompositeFixtureInfo[]) =>
  profileSearch(fixtures, /\b(tint|green\/magenta)\b/i);

export const selectionMinColorTemp = (fixtures: ParsedCompositeFixtureInfo[]) =>
  Math.max(...fixtures.map((fixture) => fixture.colorTempLow));

export const selectionMaxColorTemp = (fixtures: ParsedCompositeFixtureInfo[]) =>
  Math.min(...fixtures.map((fixture) => fixture.colorTempHigh));

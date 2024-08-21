import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";

const profileSearch = (
  fixtures: ParsedCompositeFixtureInfo[],
  regExp: RegExp,
) =>
  fixtures.every((fixture) =>
    Object.values(fixture.profileChannels).find((profile: string) =>
      regExp.test(profile),
    ),
  );

export const selectionHasColorTemp = (
  fixtures: ParsedCompositeFixtureInfo[],
  regExp = /\b(color temp|cct)\b/i,
) => {
  if (fixtures.length === 0) return true;

  return profileSearch(fixtures, regExp);
};

export const selectionHasTint = (
  fixtures: ParsedCompositeFixtureInfo[],
  regExp = /\b(tint|green\/magenta)\b/i,
) => {
  if (fixtures.length === 0) return true;

  return profileSearch(fixtures, regExp);
};

export const selectionMinColorTemp = (
  fixtures: ParsedCompositeFixtureInfo[],
) =>
  fixtures.length === 0
    ? Infinity
    : Math.max(...fixtures.map((fixture) => fixture.colorTempLow));

export const selectionMaxColorTemp = (
  fixtures: ParsedCompositeFixtureInfo[],
) =>
  fixtures.length === 0
    ? -Infinity
    : Math.min(...fixtures.map((fixture) => fixture.colorTempHigh));

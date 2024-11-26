import {
  UniverseDataObjectCollection,
  ChannelValueAnd16BitIndicator,
} from "../lib/universe-data-builder.ts";

export default class FaderCalculator {
  static calculateDiff(
    prevValues: UniverseDataObjectCollection,
    currentValues: UniverseDataObjectCollection,
  ): UniverseDataObjectCollection {
    const diff: UniverseDataObjectCollection = {};

    Object.keys(currentValues).forEach((universeKey) => {
      const universeNum = Number(universeKey);
      const currentUniverseData = currentValues[universeNum];
      const prevUniverseData = prevValues[universeNum] || [];

      if (currentUniverseData.length !== prevUniverseData.length) {
        throw new Error("Universe data lengths do not match");
      }

      const universeDiff: ChannelValueAnd16BitIndicator[] =
        currentUniverseData.map((currentPair, index) => {
          const [currentAddress, currentOutputValue, type] = currentPair;
          const prevOutputValue = prevUniverseData[index]?.[1] ?? 0;

          return [currentAddress, currentOutputValue - prevOutputValue, type];
        });

      diff[universeNum] = universeDiff;
    });
    console.log({ diff });

    return diff;
  }

  static calculateIncrement(
    diffValues: UniverseDataObjectCollection,
    steps: number,
  ): UniverseDataObjectCollection {
    const increments: UniverseDataObjectCollection = {};

    Object.keys(diffValues).forEach((universeKey) => {
      const universeNum = Number(universeKey);
      const universeDiffData = diffValues[universeNum];

      const universeIncrements: ChannelValueAnd16BitIndicator[] =
        universeDiffData.map(([address, diffValue, type]) => [
          address,
          diffValue / steps,
          type,
        ]);

      increments[universeNum] = universeIncrements;
    });
    console.log({ increments });

    return increments;
  }
}

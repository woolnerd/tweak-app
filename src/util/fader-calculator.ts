import { UniverseDataObjectCollection } from "../lib/universe-data-builder.ts";

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

      const universeDiff: number[][] = currentUniverseData.map(
        (currentPair, index) => {
          const [currentAddress, currentOutputValue] = currentPair;
          const prevOutputValue = prevUniverseData[index]?.[1] ?? 0;

          return [currentAddress, currentOutputValue - prevOutputValue];
        },
      );

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

      const universeIncrements: number[][] = universeDiffData.map(
        ([address, diffValue]) => [address, diffValue / steps],
      );

      increments[universeNum] = universeIncrements;
    });
    console.log({ increments });

    return increments;
  }
}

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
      const currentUniverseData = currentValues[universeNum] || [];
      const prevUniverseData = prevValues[universeNum];

      // ! Newly created fixtures have no output value and will break
      // ? Add default intensity values of 0? or create a dummy?
      if (currentUniverseData.length !== prevUniverseData.length) {
        throw new Error("Universe data lengths do not match");
      }

      const universeDiff: ChannelValueAnd16BitIndicator[] =
        currentUniverseData.map((currentPair, index) => {
          const [currentAddress, currentOutputValue, type] = currentPair;
          const prevOutputValue = prevUniverseData[index]?.[1] ?? 0;

          console.log({ currentOutputValue });
          console.log({ prevOutputValue });

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
        universeDiffData.flatMap((currentGroup, index) => {
          const [address, diffValue, type] = currentGroup;

          if (diffValue === 0) {
            return [currentGroup];
          }

          if (type === -1) {
            // 8-bit channel: Calculate increment normally
            return [[address, diffValue / steps, type]];
          }
          if (type === 0) {
            // 16-bit channel (coarse value)
            const fineIndex = index + 1;
            const coarseDiff = diffValue; // Coarse difference
            const fineDiff = universeDiffData[fineIndex]?.[1] || 0; // Fine difference

            // Combine coarse and fine differences into a 16-bit full difference
            const fullDiffValue = coarseDiff * 256 + fineDiff;

            // Calculate the full increment per step, keeping the sign intact
            const fullIncrement = fullDiffValue / steps;

            // Split the full increment back into coarse and fine components
            const coarseIncrement = Math.floor(fullIncrement / 256); // Coarse part
            const fineIncrement = fullIncrement % 256; // Fine part

            // Return both updated coarse and fine increments
            return [
              [address, coarseIncrement, type],
              [universeDiffData[fineIndex][0], fineIncrement, 1],
            ];
          }
          if (type === 1) {
            // Fine value handled together with coarse value, return empty
            return [];
          }

          throw new Error(`Unexpected channel type: ${type}`);
        });

      increments[universeNum] = universeIncrements;
    });

    console.log(diffValues);

    console.log("increments", increments);
    return increments;
  }
}

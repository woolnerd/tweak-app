/* eslint-disable no-else-return */
import {
  UniverseDataObjectCollection,
  ChannelValueAnd16BitIndicator,
} from "../lib/universe-data-builder.ts";

export default class FaderCalculator {
  static calculateDiff(
    startValues: UniverseDataObjectCollection,
    endValues: UniverseDataObjectCollection,
  ): UniverseDataObjectCollection {
    const diffs: UniverseDataObjectCollection = {};

    Object.keys(startValues).forEach((universeKey) => {
      const universeNum = Number(universeKey);
      const startUniverseData = startValues[universeNum];
      const endUniverseData = endValues[universeNum];

      const universeDiffs: ChannelValueAnd16BitIndicator[] =
        startUniverseData.flatMap((currentPair, index) => {
          const [address, startValue, type] = currentPair;

          if (type === 0) {
            // Handle combined coarse and fine difference for 16-bit channels
            const fineIndex = index + 1;
            const coarseStart = startValue;
            const fineStart = startUniverseData[fineIndex]?.[1] || 0;
            const coarseEnd = endUniverseData[index][1];
            const fineEnd = endUniverseData[fineIndex]?.[1] || 0;

            // Combine coarse and fine into a single 16-bit value
            const fullStartValue = (coarseStart << 8) + fineStart;
            const fullEndValue = (coarseEnd << 8) + fineEnd;

            // Calculate the difference, preserving the sign
            const diffValue = fullEndValue - fullStartValue;

            // Split back into coarse and fine for the result
            const coarseDiff = (diffValue >> 8) & 0xff;
            const fineDiff = diffValue & 0xff;

            return [
              [address, coarseDiff, type],
              [startUniverseData[fineIndex][0], fineDiff, 1],
            ];
          } else if (type === 1) {
            // Fine value is handled with coarse in the previous block
            return [];
          } else {
            // Handle 8-bit channels (type -1)
            const endValue = endUniverseData[index][1];
            const diffValue = endValue - startValue;

            return [[address, diffValue, type]];
          }
        });

      diffs[universeNum] = universeDiffs;
    });

    return diffs;
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
            const fullDiffValue = (coarseDiff << 8) + fineDiff;

            // Calculate the full increment per step, keeping the sign intact
            const fullIncrement = fullDiffValue / steps;

            // Split the full increment back into coarse and fine components
            const coarseIncrement = Math.floor(fullIncrement / 256); // Coarse part
            const fineIncrement = fullIncrement % 256; // Fine part

            // Ensure the sign is preserved during splitting
            const correctedFineIncrement =
              fineIncrement < 0 ? fineIncrement + 256 : fineIncrement;

            // Return both updated coarse and fine increments
            return [
              [address, coarseIncrement, type],
              [universeDiffData[fineIndex][0], correctedFineIncrement, 1],
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

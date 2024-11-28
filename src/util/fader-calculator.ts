import ChannelValueCalculator from "./channel-value-calculator.ts";
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

      const universeDiffs: ChannelValueAnd16BitIndicator[] = startUniverseData
        .map((currentPair, index) => {
          const [address, startValue, type] = currentPair;

          if (type === 0) {
            // Handle combined coarse and fine difference for 16-bit channels
            const fineIndex = index + 1;
            const coarseStart = startValue;
            const fineStart = startUniverseData[fineIndex]?.[1] || 0;
            const coarseEnd = endUniverseData[index][1];
            const fineEnd = endUniverseData[fineIndex]?.[1] || 0;

            // Combine coarse and fine into a single 16-bit value
            const fullStartValue = ChannelValueCalculator.build16BitValue(
              coarseStart,
              fineStart,
            );
            const fullEndValue = ChannelValueCalculator.build16BitValue(
              coarseEnd,
              fineEnd,
            );

            // Calculate the difference, preserving the sign
            const diffValue = fullEndValue - fullStartValue;

            // Split back into coarse and fine for the result
            const [coarseDiff, fineDiff] =
              ChannelValueCalculator.split16BitValues(diffValue);

            const fineAddress = startUniverseData[fineIndex][0];

            return [
              [address, coarseDiff, type],
              [fineAddress, fineDiff, 1],
            ] as ChannelValueAnd16BitIndicator[];
          }

          if (type === 1) {
            // Fine value is handled with coarse in the previous block
            return [];
          }

          // Handle 8-bit channels (type -1)
          const endValue = endUniverseData[index][1];
          const diffValue = endValue - startValue;

          return [
            [address, diffValue, type],
          ] as ChannelValueAnd16BitIndicator[];
        })
        .flat();

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
            const fullDiffValue = ChannelValueCalculator.build16BitValue(
              coarseDiff,
              fineDiff,
            );

            // Calculate the full increment per step, keeping the sign intact
            const fullIncrement = fullDiffValue / steps;

            // Split the full increment back into coarse and fine components
            const [coarseIncrement, fineIncrement] =
              ChannelValueCalculator.split16BitValues(fullIncrement);

            // Ensure the sign is preserved during splitting
            const correctedFineIncrement =
              fineIncrement < 0 ? fineIncrement + 256 : fineIncrement;

            const fineAddress = universeDiffData[fineIndex][0];

            // Return both updated coarse and fine increments
            return [
              [address, coarseIncrement, type],
              [fineAddress, correctedFineIncrement, 1],
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
    return increments;
  }
}

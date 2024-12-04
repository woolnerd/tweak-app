import { cloneDeep } from "lodash";

import ChannelValueCalculator from "./channel-value-calculator.ts";
import {
  UniverseDataObjectCollection,
  ChannelValueAnd16BitIndicator,
} from "../lib/universe-data-builder.ts";

export default class FaderCalculator {
  static calculateFadingState(
    t: number,
    outputStart: UniverseDataObjectCollection,
    outputEnd: UniverseDataObjectCollection,
  ) {
    // Update each universe's output
    const updatedOutput: UniverseDataObjectCollection = cloneDeep(outputStart);

    Object.keys(outputStart).forEach((universeKey) => {
      const universeNum = Number(universeKey);
      const currentUniverseData = outputStart[universeNum];
      const targetUniverseData = outputEnd[universeNum];

      updatedOutput[universeNum] = currentUniverseData
        .map((currentPair, index) => {
          const [address, startValue, type] = currentPair;

          if (type === -1) {
            // 8-bit channel
            const targetValue = targetUniverseData[index]?.[1] || 0;
            // Avoid rounding in the middle of the animation
            const newValue = Math.round(
              startValue + t * (targetValue - startValue),
            );

            return [
              [address, newValue, type],
            ] as ChannelValueAnd16BitIndicator[];
          }

          if (type === 0) {
            // 16-bit channel (coarse value)
            const fineIndex = index + 1;
            const coarseStart = startValue;
            const fineStart = currentUniverseData[fineIndex]?.[1] || 0;
            const coarseTarget = targetUniverseData[index][1];
            const fineTarget = targetUniverseData[fineIndex]?.[1] || 0;

            // Combine coarse and fine values to calculate the full 16-bit value
            const fullStartValue = ChannelValueCalculator.build16BitValue(
              coarseStart,
              fineStart,
            );
            const fullTargetValue = ChannelValueCalculator.build16BitValue(
              coarseTarget,
              fineTarget,
            );

            // Perform linear interpolation on the full 16-bit value
            const fullNewValue =
              fullStartValue + t * (fullTargetValue - fullStartValue);

            // Split back into coarse and fine, keeping precision until necessary
            const [newCoarseValue, newFineValue] =
              ChannelValueCalculator.split16BitValues(fullNewValue);

            const fineAddress = currentUniverseData?.[fineIndex][0];

            return [
              [address, newCoarseValue, type],
              [fineAddress, newFineValue, 1],
            ] as ChannelValueAnd16BitIndicator[];
          }

          if (type === 1) {
            // Already handled by with type === 0 check;
            return [];
          }

          throw new Error(`Unexpected channel type: ${type}`);
        })
        .flat();
    });

    return updatedOutput;
  }
}

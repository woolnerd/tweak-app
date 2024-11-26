import { isEmpty } from "lodash";

import PacketBuilder from "./packets/packet-builder.ts";
import PacketSender from "./packets/packet-sender.ts";
import UniverseDataBuilder, {
  ChannelValueAnd16BitIndicator,
  UniverseDataObjectCollection,
} from "./universe-data-builder.ts";
import FaderCalculator from "../util/fader-calculator.ts";

export default class UniverseOutputGenerator {
  public outputStart: UniverseDataObjectCollection;

  constructor(
    private readonly outputEnd: UniverseDataObjectCollection,
    // private sender: PacketSender,
  ) {
    // do nothing
  }

  public set value(outputStart: UniverseDataObjectCollection) {
    this.outputStart = outputStart;
  }

  generateOutput() {
    return Object.keys(this.outputEnd).map((universeNum) => {
      const outputData = this.outputEnd[Number(universeNum)];

      const filledData =
        UniverseDataBuilder.fillUniverseOutputValuesWithZero(outputData);

      const packet = PacketBuilder.build(Number(universeNum), filledData);

      // console.log({ outputData });

      return packet;
    });
  }

  fadeOutputValues(duration: number) {
    if (!this.outputStart) {
      throw new Error("Must define outputStart object");
    }

    const diffValues = FaderCalculator.calculateDiff(
      this.outputStart,
      this.outputEnd,
    );

    const steps = Math.ceil(duration / 60);
    const incrementValues = FaderCalculator.calculateIncrement(
      diffValues,
      steps,
    );

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const currentStep = Math.min(
        Math.floor((elapsed / duration) * steps),
        steps,
      );
      console.log(currentStep);

      if (currentStep >= steps) {
        this.outputStart = { ...this.outputEnd };
        return;
      }

      // Update each universe's output
      const updatedOutput = { ...this.outputStart };
      Object.keys(this.outputStart).forEach((universeKey) => {
        const universeNum = Number(universeKey);
        const currentUniverseData = this.outputStart[universeNum];
        const incrementData = incrementValues[universeNum];

        updatedOutput[universeNum] = currentUniverseData.flatMap(
          (currentPair, index) => {
            const [address, currentValue, type] = currentPair;
            const increment = incrementData[index]?.[1] ?? 0;

            if (type === -1) {
              // 8-bit channel
              let newValue = currentValue + increment;

              // Determine target value for this channel
              const targetValue = this.outputEnd[universeNum][index][1];

              // Clamp the new value to ensure it does not exceed the target
              if (increment < 0) {
                // Decreasing towards target
                newValue = Math.max(newValue, targetValue);
              } else {
                // Increasing towards target
                newValue = Math.min(newValue, targetValue);
              }

              // Clamp between valid DMX range
              newValue = Math.min(255, Math.max(0, newValue));

              return [[address, newValue, type]];
            }

            if (type === 0) {
              // 16-bit channel (coarse value)
              const fineIndex = index + 1;
              const coarseStart = currentValue;
              const fineStart = currentUniverseData[fineIndex]?.[1] || 0; // The next tuple is the fine value
              const coarseTarget = this.outputEnd[universeNum][index][1];
              const fineTarget = this.outputEnd[universeNum][fineIndex][1];
              const fineIncrement = incrementData[fineIndex]?.[1] ?? 0;

              // Combine coarse and fine values to calculate a full 16-bit value
              const fullStartValue = coarseStart * 256 + fineStart;
              const fullTargetValue = coarseTarget * 256 + fineTarget;

              // Calculate the full new 16-bit value
              let fullNewValue =
                fullStartValue + (increment << 8) + fineIncrement;

              // Clamp to ensure it does not exceed the target
              if (fullNewValue > fullTargetValue && increment < 0) {
                // Decreasing
                fullNewValue = Math.max(fullNewValue, fullTargetValue);
              } else if (fullNewValue < fullTargetValue && increment > 0) {
                // Increasing
                fullNewValue = Math.min(fullNewValue, fullTargetValue);
              }

              // Clamp within valid 16-bit range (0 - 65535)
              fullNewValue = Math.min(65535, Math.max(0, fullNewValue));

              // Split back into coarse and fine
              const newCoarseValue = (fullNewValue >> 8) & 0xff;
              const newFineValue = fullNewValue & 0xff;

              // Return both updated coarse and fine tuples
              if (index === 0) {
                console.log(`New coarse: ${newCoarseValue}`);
                console.log(`New fine: ${newFineValue}`);
              }

              return [
                [address, newCoarseValue, type],
                [currentUniverseData[fineIndex][0], newFineValue, 1],
              ];
            }

            if (type === 1) {
              // fine case is handled in the check for coarse case, and empty array is removed by flattening.
              return [];
            }

            throw new Error(`Unexpected channel type: ${type}`);
          },
        ) as [];
      });

      this.outputStart = updatedOutput;
      console.log({ updatedOutput });
      console.log("---------------------");

      // Generate and send the updated packets
      const packets = this.generateOutput();
      // this.sendOutput(packets);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  sendOutput(packets: Buffer[]) {
    packets.forEach((packet) => {
      this.sender.sendSACNPacket(packet);
    });
  }

  closeSocket() {
    this.sender.closeSocket();
  }

  static is16BitPair(
    testLeftChannel: ChannelValueAnd16BitIndicator,
    testRightChannel: ChannelValueAnd16BitIndicator,
  ) {
    const coarseFineIndex = 2;
    return (
      testLeftChannel[coarseFineIndex] === 0 &&
      testRightChannel[coarseFineIndex] === 1
    );
  }
}

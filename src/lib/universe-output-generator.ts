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

    const steps = Math.floor(duration / 60);
    const incrementValues = FaderCalculator.calculateIncrement(
      diffValues,
      steps,
    );

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // const currentStep = Math.min(
      //   Math.round((elapsed / duration) * steps),
      //   steps,
      // );
      // Calculate the progress factor t (between 0 and 1)
      const t = Math.min(1, elapsed / duration);
      console.log("elapsed", elapsed);
      console.log("progress factor t", t);

      if (t >= 1) {
        // Set outputStart to outputEnd when the animation is complete
        this.outputStart = { ...this.outputEnd };
        return;
      }

      // if (currentStep >= steps) {
      //   this.outputStart = { ...this.outputEnd };
      //   return;
      // }

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

            if (type === 1) {
              return [];
            }

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
              let fullNewStartValue =
                fullStartValue + increment * 256 + fineIncrement;

              // Clamp to ensure it does not exceed the target
              if (fullNewStartValue > fullTargetValue && increment < 0) {
                // Decreasing
                fullNewStartValue = Math.max(
                  fullNewStartValue,
                  fullTargetValue,
                );
              } else if (fullNewStartValue < fullTargetValue && increment > 0) {
                // Increasing
                fullNewStartValue = Math.min(
                  fullNewStartValue,
                  fullTargetValue,
                );
              }

              // Clamp within valid 16-bit range (0 - 65535)
              fullNewStartValue = Math.min(
                fullTargetValue,
                Math.max(0, fullNewStartValue),
              );

              // Split back into coarse and fine
              const newCoarseValue = (fullNewStartValue >> 8) & 0xff;
              const newFineValue = fullNewStartValue & 0xff;

              return [
                [address, newCoarseValue, type],
                [currentUniverseData[fineIndex][0], newFineValue, 1],
              ];
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

import { cloneDeep } from "lodash";

import PacketBuilder from "./packets/packet-builder.ts";
import PacketSender from "./packets/packet-sender.ts";
import UniverseDataBuilder, {
  ChannelValueAnd16BitIndicator,
  UniverseDataObjectCollection,
} from "./universe-data-builder.ts";
import ChannelValueCalculator from "../util/channel-value-calculator.ts";

export default class UniverseOutputGenerator {
  public outputStart: UniverseDataObjectCollection;

  private fadingState: UniverseDataObjectCollection;

  constructor(
    private readonly outputEnd: UniverseDataObjectCollection,
    private sender: PacketSender,
  ) {
    // Initialize fading state as an empty object
    this.fadingState = {};
  }

  public set value(outputStart: UniverseDataObjectCollection) {
    this.outputStart = outputStart;
    this.fadingState = cloneDeep(outputStart); // Initialize fadingState to start with outputStart
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

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      // Calculate the total elapsed time
      const elapsed = timestamp - startTime;

      // Calculate the progress factor t (between 0 and 1)
      const t = Math.min(1, elapsed / duration);

      if (t >= 1) {
        // Set outputStart to outputEnd when the animation is complete
        this.outputStart = cloneDeep(this.outputEnd);
        return;
      }

      // Update fadingState to the newly calculated state
      const updatedOutput = this.calculateFadingState(t);
      this.fadingState = updatedOutput;

      // Generate and optionally send the updated packets using the fadingState
      const packets = this.generateOutput();
      // Uncomment to send the output if needed
      this.sendOutput(packets);

      // Request the next animation frame if the animation is not complete
      requestAnimationFrame(animate);
    };

    // Start the animation
    requestAnimationFrame(animate);
  }

  calculateFadingState(t: number) {
    // Update each universe's output
    const updatedOutput: UniverseDataObjectCollection = cloneDeep(
      this.outputStart,
    );

    Object.keys(this.outputStart).forEach((universeKey) => {
      const universeNum = Number(universeKey);
      const currentUniverseData = this.outputStart[universeNum];
      const targetUniverseData = this.outputEnd[universeNum];

      updatedOutput[universeNum] = currentUniverseData
        .map((currentPair, index) => {
          const [address, startValue, type] = currentPair;

          if (type === -1) {
            // 8-bit channel
            const targetValue = targetUniverseData[index]?.[1] || 0;
            // Avoid rounding in the middle of the animation
            const newValue = startValue + t * (targetValue - startValue);
            console.log(address, newValue, type);

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

            console.log(address, newCoarseValue, newFineValue, type);

            const fineAddress = currentUniverseData?.[fineIndex][0];

            return [
              [address, newCoarseValue, type],
              [fineAddress, newFineValue, 1],
            ] as ChannelValueAnd16BitIndicator[];
          }

          if (type === 1) {
            return [];
          }

          throw new Error(`Unexpected channel type: ${type}`);
        })
        .flat();
    });

    return updatedOutput;
  }

  sendOutput(packets: Buffer[]) {
    packets.forEach((packet) => {
      this.sender.sendSACNPacket(packet);
    });
  }

  closeSocket() {
    this.sender.closeSocket();
  }
}

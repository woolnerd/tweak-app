import { isEmpty } from "lodash";

import PacketBuilder from "./packets/packet-builder.ts";
import PacketSender from "./packets/packet-sender.ts";
import UniverseDataBuilder, {
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
    const steps = Math.ceil(duration / 50);
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

        updatedOutput[universeNum] = currentUniverseData.map(
          (currentPair, index) => {
            const [address, currentValue] = currentPair;
            const increment = incrementData[index]?.[1] ?? 0;

            // Calculate the new value
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

            // Also, clamp between valid DMX range
            newValue = Math.min(255, Math.max(0, newValue));

            if (address === 0 || address === 1) {
              console.log(newValue);
            }

            return [address, newValue];
          },
        );
      });

      this.outputStart = updatedOutput;
      // console.log({ updatedOutput });

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
}

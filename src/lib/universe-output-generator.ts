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

      console.log({ outputData });

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

    const steps = duration / 50; // Assuming 50ms per step for smooth animation

    const incrementValues = FaderCalculator.calculateIncrement(
      diffValues,
      steps,
    );

    let currentStep = 0;

    console.log("being start", this.outputStart);
    console.log("begin end", this.outputEnd);

    const intervalId = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(intervalId);
        this.outputStart = { ...this.outputEnd };
        return;
      }

      // Increment the output values for each universe
      Object.keys(this.outputStart).forEach((universeKey) => {
        const universeNum = Number(universeKey);
        const currentUniverseData = this.outputStart[universeNum];
        const incrementData = incrementValues[universeNum];

        this.outputStart[universeNum] = currentUniverseData.map(
          (currentPair, index) => {
            const [address, currentValue] = currentPair;
            const increment = incrementData[index]?.[1] ?? 0;

            return [address, currentValue + increment];
          },
        );
        // debugger;
        console.log("this.outputEnd:", this.outputEnd);
      });

      // Generate and send the updated packets
      const packets = this.generateOutput();
      // console.log({ incrementValues });

      // console.log({ packets });

      // this.sendOutput(packets);

      currentStep += 1;
    }, 50);
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

import { cloneDeep } from "lodash";

import PacketBuilder from "./packets/packet-builder.ts";
import PacketSender from "./packets/packet-sender.ts";
import UniverseDataBuilder, {
  UniverseDataObjectCollection,
} from "./universe-data-builder.ts";
import FaderCalculator from "../util/fader-calculator.ts";

export default class UniverseOutputGenerator {
  public outputStart: UniverseDataObjectCollection;

  private fadingState: UniverseDataObjectCollection;

  constructor(
    private readonly outputEnd: UniverseDataObjectCollection,
    private sender: PacketSender,
  ) {
    this.fadingState = {};
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
    const fade = (timestamp: number) => {
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
      const updatedOutput = FaderCalculator.calculateFadingState(
        t,
        this.outputStart,
        this.outputEnd,
      );

      this.fadingState = updatedOutput;

      // Generate and optionally send the updated packets using the fadingState
      const packets = this.generateOutput();

      this.sendOutput(packets);

      // Request the next animation frame if the animation is not complete
      requestAnimationFrame(fade);
    };

    // Start the fade
    requestAnimationFrame(fade);
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

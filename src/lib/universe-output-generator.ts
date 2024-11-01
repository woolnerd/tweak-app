import PacketBuilder from "./packets/packet-builder.ts";
import PacketSender from "./packets/packet-sender.ts";
import UniverseDataBuilder, {
  UniverseDataObjectCollection,
} from "./universe-data-builder.ts";
import FaderCalculator from "../util/fader-calculator.ts";

export default class UniverseOutputGenerator {
  private previousOutputValuesStore: UniverseDataObjectCollection;

  constructor(
    private readonly outputValuesStore: UniverseDataObjectCollection,
    private sender: PacketSender,
  ) {
    this.previousOutputValuesStore = { ...outputValuesStore };
  }

  generateOutput() {
    return Object.keys(this.outputValuesStore).map((universeNum) => {
      const outputData = this.outputValuesStore[Number(universeNum)];
      const filledData =
        UniverseDataBuilder.fillUniverseOutputValuesWithZero(outputData);
      const packet = PacketBuilder.build(Number(universeNum), filledData);
      console.log(filledData);
      return packet;
    });
  }

  fadeOutputValues(duration: number) {
    const diffValues = FaderCalculator.calculateDiff(
      this.previousOutputValuesStore,
      this.outputValuesStore,
    );
    const steps = duration / 50; // Assuming 50ms per step for smooth animation
    const incrementValues = FaderCalculator.calculateIncrement(
      diffValues,
      steps,
    );

    let currentStep = 0;

    const intervalId = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(intervalId);
        this.previousOutputValuesStore = { ...this.outputValuesStore };
        return;
      }

      // Increment the output values for each universe
      Object.keys(this.previousOutputValuesStore).forEach((universeKey) => {
        const universeNum = Number(universeKey);
        const currentUniverseData = this.previousOutputValuesStore[universeNum];
        const incrementData = incrementValues[universeNum];

        this.previousOutputValuesStore[universeNum] = currentUniverseData.map(
          (currentPair, index) => {
            const [address, currentValue] = currentPair;
            const increment = incrementData[index]?.[1] ?? 0;

            return [address, currentValue + increment];
          },
        );
      });

      // Generate and send the updated packets
      const packets = this.generateOutput();
      this.sendOutput(packets);

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

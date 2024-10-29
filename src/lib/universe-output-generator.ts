import PacketBuilder from "./packets/packet-builder.ts";
import PacketSender from "./packets/packet-sender.ts";
import UniverseDataBuilder, {
  UniverseDataObjectCollection,
} from "./universe-data-builder.ts";

export default class UniverseOutputGenerator {
  constructor(
    private readonly outputValuesStore: UniverseDataObjectCollection,
    private sender: PacketSender,
  ) {
    // do nothing
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

  sendOutput(packets: Buffer[]) {
    packets.forEach((packet) => {
      this.sender.sendSACNPacket(packet);
    });
    this.sender.closeSocket();
  }
}

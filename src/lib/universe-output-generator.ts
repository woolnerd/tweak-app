import PacketBuilder from "./packets/packet-builder.ts";
import PacketSender from "./packets/packet-sender.ts";
import UniverseDataBuilder, {
  UniverseDataObjectCollection,
} from "./universe-data-builder.ts";

export default class UniverseOutputGenerator {
  private readonly outputValuesStore;

  private sender;

  constructor(
    outputValuesStore: UniverseDataObjectCollection,
    port: number = 5568,
    ip = "172.20.10.3",
  ) {
    this.outputValuesStore = outputValuesStore;
    this.sender = new PacketSender(port, ip);
  }

  generateOutput() {
    return Object.keys(this.outputValuesStore).map((universeNum) => {
      const outputData = this.outputValuesStore[Number(universeNum)];
      const filledData =
        UniverseDataBuilder.fillUniverseOutputValuesWithZero(outputData);
      const packetBuilder = new PacketBuilder(Number(universeNum), filledData);
      console.log(filledData);
      return packetBuilder.packet;
    });
  }

  sendOutput(packets: Buffer[]) {
    packets.forEach((packet) => {
      this.sender.sendSACNPacket(packet);
    });
    this.sender.closeSocket();
  }
}

import { Buffer } from "buffer";

export default class PacketBuilder {
  private packetBuffer: Buffer;

  constructor(
    private readonly universe: number,
    private readonly data: number[],
  ) {
    // do nothing
  }

  build() {
    // Allocate a buffer for the sACN packet
    this.packetBuffer = Buffer.alloc(638);
    this.packetBuffer.writeUInt16BE(0x0010, 0); // Example: Write some values to the packet
    this.packetBuffer.writeUInt16BE(this.universe, 2); // Write the universe to the appropriate position
    this.packetBuffer.set(this.data, 10); // Assume DMX data starts at byte 10
  }

  public get packet(): Buffer {
    if (!this.packetBuffer) {
      throw new Error(
        "PacketBuilder#build must be called before calling #packet",
      );
    }
    return this.packetBuffer;
  }
}

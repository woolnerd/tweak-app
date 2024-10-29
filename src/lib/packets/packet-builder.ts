/* eslint-disable no-bitwise */
import { Buffer } from "buffer";

export default class PacketBuilder {
  private readonly universe: number;

  private readonly dmxData: number[];

  public packet: Buffer;

  static build(universe: number, dmxData: number[]) {
    const PDU_HEADER_LENGTH = 126; // Updated to include the full header length
    const ROOT_VECTOR = 0x00000004;
    const FRAMING_VECTOR = 0x00000002;
    const SOURCE_NAME = "Source Name";
    const CID = Buffer.alloc(16, 1); // CID is a unique identifier for each source (UUID-like)
    const SEQUENCE = 0; // Sequence number, incremented each packet to maintain order
    const PRIORITY = 100; // Priority of the packet (0-200)
    const OPTIONS = 0; // Default Options value
    const START_CODE = 0; // Default start code

    const dmxLength = Math.min(dmxData.length, 512); // DMX data max length is 512 bytes

    const totalPacketLength = PDU_HEADER_LENGTH + dmxLength;
    const packet = Buffer.alloc(totalPacketLength);

    // Root Layer
    packet.writeUInt16BE(0x0010, 0); // Preamble size
    packet.writeUInt16BE(0x0000, 2); // Post-amble size
    packet.write("ASC-E1.17", 4, "ascii"); // ACN Packet Identifier
    packet.writeUInt16BE(0x7000 | (totalPacketLength - 16), 16); // Root Layer length (adjusted)
    packet.writeUInt32BE(ROOT_VECTOR, 18); // Root Vector (streaming data)
    CID.copy(packet, 22); // CID

    // Framing Layer
    packet.writeUInt16BE(0x7000 | (totalPacketLength - 38), 38); // Framing Layer length
    packet.writeUInt32BE(FRAMING_VECTOR, 40); // Framing Vector
    packet.write(SOURCE_NAME, 44, "ascii"); // Source Name
    packet.writeUInt8(PRIORITY, 108); // Priority
    packet.writeUInt8(SEQUENCE, 111); // Sequence Number
    packet.writeUInt8(OPTIONS, 112); // Options
    packet.writeUInt16BE(universe, 113); // Universe number

    // DMP Layer (DMX data)
    packet.writeUInt16BE(0x7000 | (dmxLength + 11), 114); // DMP length
    packet.writeUInt8(0x02, 116); // DMP Vector
    packet.writeUInt8(0xa1, 117); // Address Type & Data Type
    packet.writeUInt16BE(0, 118); // First Property Address
    packet.writeUInt16BE(513, 120); // Address Increment
    packet.writeUInt16BE(dmxLength + 1, 122); // Property value count
    packet.writeUInt8(START_CODE, 124); // DMX Start Code

    // Write DMX data
    for (let i = 0; i < dmxLength; i += 1) {
      packet.writeUInt8(dmxData[i], 125 + i);
    }

    return packet;
  }
}

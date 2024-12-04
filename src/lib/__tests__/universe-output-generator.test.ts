/* eslint-disable dot-notation */
import PacketBuilder from "../packets/packet-builder.ts";
import PacketSender from "../packets/packet-sender.ts";
import UniverseDataBuilder, {
  UniverseDataObjectCollection,
} from "../universe-data-builder.ts";
import UniverseOutputGenerator from "../universe-output-generator.ts";

jest.mock("../packets/packet-sender.ts");
jest.mock("../universe-data-builder.ts");
jest.mock("../packets/packet-builder.ts");
jest.mock("../packets/packet-sender.ts");

describe("UniverseOutputGenerator constructor", () => {
  let mockPacketSender: PacketSender;
  let mockOutputEnd: UniverseDataObjectCollection;

  beforeEach(() => {
    mockOutputEnd = {
      1: [
        [0, 155, 0],
        [1, 255, 1],
      ],
    };
    mockPacketSender = new PacketSender();
  });

  test("it instantiates a UniverseOutputGenerator", () => {
    const universeOutputGenerator = new UniverseOutputGenerator(
      mockOutputEnd,
      mockPacketSender,
    );
    expect(universeOutputGenerator["outputEnd"]).toBe(mockOutputEnd);
    expect(universeOutputGenerator["sender"]).toBe(mockPacketSender);
    expect(universeOutputGenerator.fadeOutputValues).toBeDefined();
  });

  test("should throw an error if outputValuesStore is not provided and generateOutput is called", () => {
    const universeOutputGenerator = new UniverseOutputGenerator(
      undefined as any,
      mockPacketSender,
    );
    expect(() => universeOutputGenerator.generateOutput()).toThrow();
  });

  describe("generateOutput", () => {
    it("should generate packets for each universe in outputValuesStore", () => {
      const mockFilledData = "filledData";
      const mockPacket = Buffer.from("mockPacket");

      UniverseDataBuilder.fillUniverseOutputValuesWithZero = jest
        .fn()
        .mockReturnValue(mockFilledData);

      jest
        .spyOn(PacketBuilder, "build")
        .mockReturnValue(Buffer.from("mockPacket"));

      mockOutputEnd = {
        1: [
          [1, 155, 0],
          [2, 255, 1],
        ],
        2: [
          [10, 100, 0],
          [20, 255, 1],
        ],
      };

      const universeOutputGenerator = new UniverseOutputGenerator(
        mockOutputEnd,
        mockPacketSender,
      );
      const packets = universeOutputGenerator.generateOutput();

      expect(
        UniverseDataBuilder.fillUniverseOutputValuesWithZero,
      ).toHaveBeenCalledTimes(2);
      expect(
        UniverseDataBuilder.fillUniverseOutputValuesWithZero,
      ).toHaveBeenCalledWith([
        [1, 155, 0],
        [2, 255, 1],
      ]);
      expect(
        UniverseDataBuilder.fillUniverseOutputValuesWithZero,
      ).toHaveBeenCalledWith([
        [1, 155, 0],
        [2, 255, 1],
      ]);
      expect(PacketBuilder.build).toHaveBeenCalledTimes(2);
      expect(PacketBuilder.build).toHaveBeenCalledWith(1, mockFilledData);
      expect(PacketBuilder.build).toHaveBeenCalledWith(2, mockFilledData);
      expect(packets).toEqual([mockPacket, mockPacket]);
    });
  });

  describe("sendOutput", () => {
    test("should send each packet and then close the socket", () => {
      const universeOutputGenerator = new UniverseOutputGenerator(
        mockOutputEnd,
        mockPacketSender,
      );
      const packets = [Buffer.from("packet1"), Buffer.from("packet2")];

      universeOutputGenerator.sendOutput(packets);

      expect(mockPacketSender.sendSACNPacket).toHaveBeenCalledTimes(
        packets.length,
      );
      packets.forEach((packet) => {
        expect(mockPacketSender.sendSACNPacket).toHaveBeenCalledWith(packet);
      });
    });
  });

  describe("closeSocket", () => {
    test("it closes the socket", () => {
      const universeOutputGenerator = new UniverseOutputGenerator(
        mockOutputEnd,
        mockPacketSender,
      );
      universeOutputGenerator.closeSocket();
      expect(mockPacketSender.closeSocket).toHaveBeenCalled();
    });
  });
  describe("fadeOutputValues", () => {
    jest.useFakeTimers();
    test("it invokes generateOutput", () => {
      const universeOutputGenerator = new UniverseOutputGenerator(
        mockOutputEnd,
        mockPacketSender,
      );
      jest.spyOn(universeOutputGenerator, "generateOutput");

      universeOutputGenerator.outputStart = { 1: [[0, 255, -1]] };
      universeOutputGenerator.fadeOutputValues(1000);
      jest.runAllTimers();
      expect(universeOutputGenerator.generateOutput).toHaveBeenCalled();
    });
  });
});

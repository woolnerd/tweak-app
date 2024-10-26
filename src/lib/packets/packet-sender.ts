import dgram from "react-native-udp";
import UdpSocket from "react-native-udp/lib/types/UdpSocket";

export default class PacketSender {
  constructor(
    private readonly port: number,
    private readonly ip: string,
    private readonly socket: UdpSocket = dgram.createSocket({ type: "udp4" }),
  ) {
    this.socket.bind(this.port, () => {
      console.log(`Socket bound to port ${this.port}`);
    });
  }

  sendSACNPacket(packet: Buffer) {
    this.socket.send(packet, 0, packet.length, this.port, this.ip, (err) => {
      if (err) {
        console.error("Error sending sACN packet:", err);
      } else {
        console.log("sACN packet sent successfully!");
      }
    });
  }

  public closeSocket() {
    this.socket.close();
  }
}

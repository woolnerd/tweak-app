import ChannelNumber from "./channel-number.ts";
import DmxValue from "./dmx-value.ts";
import Universe from "./universe.ts";

type DmxTuple = [ChannelNumber, DmxValue];

export default class ValueUniverse extends Universe<DmxTuple> {
  public get getDmxValues() {
    return this.addresses;
  }

  public set setDmxValues(dmxTuple: DmxTuple) {
    this.addresses.push(dmxTuple);
  }

  public buildUniverse(): (number | null)[] {
    const display: (number | null)[] = Array(512).fill(null);

    this.getDmxValues.forEach((tuple) => {
      const [channel, dmxValue] = tuple;
      display[channel.value] = dmxValue.value;
    });

    return display;
  }
}

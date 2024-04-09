import Universe from "./universe";
import { DmxValue } from "./dmx-value";
import { ChannelNumber } from "./channel-number";

type DmxTuple = [ChannelNumber, DmxValue];

export default class ValueUniverse extends Universe<DmxTuple> {
  constructor(_number: number) {
    super(_number);
  }

  public get getDmxValues() {
    return this._addresses;
  }

  public set setDmxValues(dmxTuple: DmxTuple) {
    this._addresses.push(dmxTuple);
  }

  public buildUniverse(): Array<number | null> {
    const display: Array<number | null> = Array(512).fill(null);

    this.getDmxValues.forEach((tuple) => {
      const [channel, dmxValue] = tuple;
      display[channel.value] = dmxValue.value;
    });

    return display;
  }
}

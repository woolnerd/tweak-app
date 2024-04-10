import ChannelNumber from "../channel-number.ts";
import DmxValue from "../dmx-value.ts";
import ValueUniverse from "../value-universe.ts";

describe("ValueUniverse", () => {
  let valueUniverse: ValueUniverse;

  beforeEach(() => {
    valueUniverse = new ValueUniverse(1);
  });

  it("creates a ValueUniverse instance", () => {
    expect(valueUniverse).toBeInstanceOf(ValueUniverse);
  });

  it("sets and gets DMX values", () => {
    const channel = new ChannelNumber(10);
    const dmxValue = new DmxValue(100);
    valueUniverse.setDmxValues = [channel, dmxValue];

    const dmxValues = valueUniverse.getDmxValues;
    expect(dmxValues.length).toBe(1);
    expect(dmxValues[0]).toEqual([channel, dmxValue]);
  });

  it("builds the universe display", () => {
    const channel1 = new ChannelNumber(10);
    const dmxValue1 = new DmxValue(100);
    const channel2 = new ChannelNumber(20);
    const dmxValue2 = new DmxValue(200);
    valueUniverse.setDmxValues = [channel1, dmxValue1];
    valueUniverse.setDmxValues = [channel2, dmxValue2];

    const display = valueUniverse.buildUniverse();
    expect(display[channel1.value]).toBe(dmxValue1.value);
    expect(display[channel2.value]).toBe(dmxValue2.value);

    console.log(display);
  });
});

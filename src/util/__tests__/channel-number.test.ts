import ChannelNumber from "../channel-number.ts";

describe("ChannelNumber", () => {
  it("creates a valid ChannelNumber object", () => {
    expect(() => new ChannelNumber(100)).not.toThrow();
  });

  it("throws an error for out-of-bounds value", () => {
    expect(() => new ChannelNumber(-1)).toThrow(
      "Value must be between 0 and 511",
    );
    expect(() => new ChannelNumber(512)).toThrow(
      "Value must be between 0 and 511",
    );
  });

  it("sets the value property correctly", () => {
    const channelNumber = new ChannelNumber(150);
    expect(channelNumber.value).toBe(150);
  });
});
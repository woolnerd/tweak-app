import { DmxValue } from './dmx-value';

describe('DmxValue', () => {
  it('creates a valid DmxValue object', () => {
    expect(() => new DmxValue(100)).not.toThrow();
  });

  it('throws an error for out-of-bounds value', () => {
    expect(() => new DmxValue(-1)).toThrow('Value must be between 0 and 255');
    expect(() => new DmxValue(256)).toThrow('Value must be between 0 and 255');
  });

  it('sets the value property correctly', () => {
    const dmxValue = new DmxValue(150);
    expect(dmxValue.value).toBe(150);
  });
});

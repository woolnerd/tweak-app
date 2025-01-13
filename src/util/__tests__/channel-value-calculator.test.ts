/* eslint-disable dot-notation */
import ChannelValueCalculator from "../channel-value-calculator.ts";

describe("ChannelValueCalculator", () => {
  describe("Constructor", () => {
    test("should correctly initialize the percentage property", () => {
      const calculator = new ChannelValueCalculator(50);
      expect(calculator["percentage"]).toBe(50);
    });
  });

  describe("calc16BitValues Method", () => {
    // From Eos console
    // 30% should be 19661 = coarse 76, fine 205
    // 74% should 48496 = coarse 189, fine 112
    test("should return an array of two numbers representing the coarse and fine DMX values", () => {
      let calculator = new ChannelValueCalculator(30);
      let values = calculator.calc16BitValues();
      expect(Array.isArray(values)).toBeTruthy();
      expect(calculator["calcPercentOfFullDMXVal"]).toBe(19661);
      expect(values).toHaveLength(2);
      expect(values[0]).toBe(76);
      expect(values[1]).toBeGreaterThanOrEqual(205);

      calculator = new ChannelValueCalculator(74);
      values = calculator.calc16BitValues();
      expect(calculator["calcPercentOfFullDMXVal"]).toBe(48496);
      expect(Array.isArray(values)).toBeTruthy();
      expect(values).toHaveLength(2);
      expect(values[0]).toBe(189);
      expect(values[1]).toBe(112);

      calculator = new ChannelValueCalculator(100);
      values = calculator.calc16BitValues();
      expect(calculator["calcPercentOfFullDMXVal"]).toBe(65535);
      expect(Array.isArray(values)).toBeTruthy();
      expect(values).toHaveLength(2);
      expect(values[0]).toBe(255);
      expect(values[1]).toBe(255);
    });
  });

  describe("8bit value methods", () => {
    let calculator = new ChannelValueCalculator(100);
    expect(calculator.calc8BitValues()[0]).toStrictEqual(255);
    calculator = new ChannelValueCalculator(50);
    expect(calculator.calc8BitValues()[0]).toStrictEqual(128);
    calculator = new ChannelValueCalculator(30);
    expect(calculator.calc8BitValues()[0]).toStrictEqual(76);
  });

  describe("DMX to percentage should result in integer", () => {
    expect(ChannelValueCalculator.dmxToPercentage([[1, 255]])).toBe(100);

    expect(ChannelValueCalculator.dmxToPercentage([[1, 128]])).toBe(50);

    expect(
      ChannelValueCalculator.dmxToPercentage([
        [1, 128],
        [2, 128],
      ]),
    ).toBe(25);

    expect(
      ChannelValueCalculator.dmxToPercentage([
        [1, 255],
        [2, 255],
      ]),
    ).toBe(100);
  });

  describe("Edge Cases for Percentage Values", () => {
    test("should handle percentage being 0", () => {
      const calculator = new ChannelValueCalculator(0);
      expect(calculator.calc16BitValues()).toEqual([0, 0]);
    });

    test("should handle percentage being 100", () => {
      const calculator = new ChannelValueCalculator(100);
      const coarseValue = Math.trunc(calculator["coarseValue"]);
      const fineValue = Math.trunc(calculator["fineValue"]);
      expect(calculator.calc16BitValues()).toEqual([coarseValue, fineValue]);
    });

    test("should not throw an error when the percentage is within the valid range", () => {
      expect(() => new ChannelValueCalculator(50)).not.toThrow();
    });

    test("should throw an error with the correct message when the percentage is -101", () => {
      expect(() => new ChannelValueCalculator(-101)).toThrow(
        "Percentage cannot be less than -100",
      );
    });

    test("should throw an error with the correct message when the percentage is over 100", () => {
      expect(() => new ChannelValueCalculator(101)).toThrow(
        "Percentage cannot be greater than 100",
      );
    });
  });
});

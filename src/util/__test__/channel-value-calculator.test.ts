/* eslint-disable dot-notation */
import ChannelValueCalculator from "../channel-value-calculator.ts";

describe("ChannelValueCalculator", () => {
  describe("Constructor", () => {
    it("should correctly initialize the percentage property", () => {
      const calculator = new ChannelValueCalculator(50);
      expect(calculator["percentage"]).toBe(50);
    });
  });

  describe("calc16BitValues Method", () => {
    // From Eos console
    // 30% should be 19661 = coarse 76, fine 205
    // 74% should 48496 = coarse 189, fine 112
    it("should return an array of two numbers representing the coarse and fine DMX values", () => {
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

  describe("Edge Cases for Percentage Values", () => {
    it("should handle percentage being 0", () => {
      const calculator = new ChannelValueCalculator(0);
      expect(calculator.calc16BitValues()).toEqual([0, 0]);
    });

    it("should handle percentage being 100", () => {
      const calculator = new ChannelValueCalculator(100);
      const coarseValue = Math.trunc(calculator["coarseValue"]);
      const fineValue = Math.trunc(calculator["fineValue"]);
      expect(calculator.calc16BitValues()).toEqual([coarseValue, fineValue]);
    });

    it("should not throw an error when the percentage is within the valid range", () => {
      expect(() => new ChannelValueCalculator(50)).not.toThrow();
    });

    it("should throw an error with the correct message when the percentage is -101", () => {
      expect(() => new ChannelValueCalculator(-101)).toThrow(
        "Percentage cannot be less than -100",
      );
    });

    it("should throw an error with the correct message when the percentage is over 100", () => {
      expect(() => new ChannelValueCalculator(101)).toThrow(
        "Percentage cannot be greater than 100",
      );
    });
  });
});

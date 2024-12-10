import { AddressTuples } from "../../models/types/scene-to-fixture-assignment.ts";
import {
  merge16BitValues,
  convertDmxValueToPercent,
  percentageToColorTemperature,
  percentageToIntensityLevel,
} from "../helpers.ts";

describe("Merge 16bit values", () => {
  test("it properly merges two tuples of dmx values", () => {
    const channelPairs16Bit = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    const values: AddressTuples = [
      [1, 128],
      [2, 128],
      [7, 255],
    ];

    const values8Bit: AddressTuples = [
      [7, 255],
      [8, 255],
    ];

    expect(merge16BitValues(channelPairs16Bit, values)).toStrictEqual([
      [1, 32896],
      [7, 255],
    ]);
    expect(merge16BitValues(channelPairs16Bit, values8Bit)).toStrictEqual([
      [7, 255],
      [8, 255],
    ]);
  });

  describe("Convert DMX Value to Percent", () => {
    test("presentValueAsPrecent returns the correct integer", () => {
      expect(convertDmxValueToPercent(65535)).toBe(100);
      expect(convertDmxValueToPercent(65025)).toBe(99.22);
      expect(convertDmxValueToPercent(49151)).toBe(75);
      expect(convertDmxValueToPercent(48905)).toBe(74.62);
      expect(convertDmxValueToPercent(45875)).toBe(70);
      expect(convertDmxValueToPercent(6554)).toBe(10);
      expect(convertDmxValueToPercent(257)).toBe(0.39);
      expect(convertDmxValueToPercent(255)).toBe(100);
      expect(convertDmxValueToPercent(128)).toBe(50.2);
    });
  });

  describe("Percentage to color temperature", () => {
    test("converts percentage to color temperature rounded to the nearest hundred", () => {
      expect(percentageToColorTemperature(100, 2800, 10000)).toBe(10000);
      expect(percentageToColorTemperature(100, 2000, 10000)).toBe(10000);
      expect(percentageToColorTemperature(76, 2800, 10000)).toBe(8300);
      expect(percentageToColorTemperature(76.5, 2000, 10000)).toBe(8100);
      expect(percentageToColorTemperature(55.55, 2800, 10000)).toBe(6800);
      expect(percentageToColorTemperature(55.55, 2000, 10000)).toBe(6400);
      expect(percentageToColorTemperature(0, 2800, 10000)).toBe(2800);
    });
  });

  describe("Percentage to intensity level", () => {
    expect(percentageToIntensityLevel(50.2)).toBe(50);
    expect(percentageToIntensityLevel(99.99)).toBe(100);
    expect(percentageToIntensityLevel(0)).toBe(0);
    expect(percentageToIntensityLevel(0.5)).toBe(1);
  });
});

import { UniverseDataObjectCollection } from "../../lib/universe-data-builder.ts";
import FaderCalculator from "../fader-calculator.ts";

const mockOutputStartValues: UniverseDataObjectCollection = {
  1: [
    [0, 255, 0],
    [1, 255, 1],
    [2, 128, 0],
    [3, 36, 1],
  ],
  2: [
    [0, 128, 0],
    [1, 0, 1],
    [2, 12, 0],
    [3, 3, 1],
  ],
};

const mockOutputEndValues: UniverseDataObjectCollection = {
  1: [
    [0, 200, 0],
    [1, 200, 1],
    [2, 100, 0],
    [3, 37, 1],
  ],
  2: [
    [0, 128, 0],
    [1, 0, 1],
    [2, 12, 0],
    [3, 40, 1],
  ],
};

describe("calculateFadingState", () => {
  test("it returns an object with the difference of output values", () => {
    const fade = FaderCalculator.calculateFadingState(
      0.5,
      mockOutputStartValues,
      mockOutputEndValues,
    );

    expect(fade).toEqual({
      1: [
        [0, 228, 0],
        [1, 99, 1],
        [2, 114, 0],
        [3, 36, 1],
      ],
      2: [
        [0, 128, 0],
        [1, 0, 1],
        [2, 12, 0],
        [3, 21, 1],
      ],
    });
  });
});

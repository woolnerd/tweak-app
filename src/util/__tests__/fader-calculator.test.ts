import { UniverseDataObjectCollection } from "../../lib/universe-data-builder.ts";
import FaderCalculator from "../fader-calculator.ts";

const mockPrevValues: UniverseDataObjectCollection = {
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

const mockOutputValues: UniverseDataObjectCollection = {
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

describe("calculateDiff", () => {
  test("it returns an object with the difference of output values", () => {
    const diff = FaderCalculator.calculateDiff(
      mockPrevValues,
      mockOutputValues,
    );
    expect(diff).toEqual({
      1: [
        [0, -55],
        [1, -55],
        [2, -28],
        [3, 1],
      ],
      2: [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 37],
      ],
    });
  });

  test("it throws an error if a universe length is different between previous and current outputs", () => {
    const mockOutputValuesShortLength: UniverseDataObjectCollection = {
      1: [
        [0, 200, 0],
        [1, 200, 1],
        [2, 100, 0],
        [3, 37, 1],
      ],
      2: [
        [0, 128, 0],
        [1, 0, 1],
        [2, 12, -1],
      ],
    };

    expect(() => {
      FaderCalculator.calculateDiff(
        mockPrevValues,
        mockOutputValuesShortLength,
      );
    }).toThrow(new Error("Universe data lengths do not match"));
  });
});

describe("calculateIncrement", () => {
  test("it calculates increments based on steps", () => {
    const diff = FaderCalculator.calculateDiff(
      mockPrevValues,
      mockOutputValues,
    );
    const steps = 100;
    const increments = FaderCalculator.calculateIncrement(diff, steps);

    expect(increments).toEqual({
      1: [
        [0, -0.55, 0],
        [1, -0.55, 1],
        [2, -0.28, 0],
        [3, 0.01, 1],
      ],
      2: [
        [0, 0, 0],
        [1, 0, 1],
        [2, 0, 0],
        [3, 0.37, 1],
      ],
    });
  });
});

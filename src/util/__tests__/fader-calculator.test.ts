import { UniverseDataObjectCollection } from "../../lib/universe-data-builder.ts";
import FaderCalculator from "../fader-calculator.ts";

const mockPrevValues: UniverseDataObjectCollection = {
  1: [
    [0, 255],
    [1, 255],
    [2, 128],
    [3, 36],
  ],
  2: [
    [0, 128],
    [1, 0],
    [2, 12],
    [3, 3],
  ],
};

const mockOutputValues: UniverseDataObjectCollection = {
  1: [
    [0, 200],
    [1, 200],
    [2, 100],
    [3, 37],
  ],
  2: [
    [0, 128],
    [1, 0],
    [2, 12],
    [3, 40],
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
        [0, 200],
        [1, 200],
        [2, 100],
        [3, 37],
      ],
      2: [
        [0, 128],
        [1, 0],
        [2, 12],
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
        [0, -0.55],
        [1, -0.55],
        [2, -0.28],
        [3, 0.01],
      ],
      2: [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0.37],
      ],
    });
  });
});

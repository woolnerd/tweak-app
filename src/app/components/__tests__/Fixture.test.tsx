import { render, waitFor } from "@testing-library/react-native";

import "@testing-library/jest-dom";

import React from "react";

import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import Fixture from "../Fixture/Fixture.tsx";

describe("Fixture component", () => {
  const fixture: ParsedCompositeFixtureInfo = {
    fixtureAssignmentId: 1,
    channel: 1,
    values: [
      [1, 128],
      [2, 128],
    ],
    profileChannels: {
      1: "intensity coarse",
      2: "intensity fine",
      3: "color temp coarse",
      4: "color temp fine",
    },
    profileName: "Profile 1",
    fixtureName: "Fixture 1",
    fixtureNotes: "no notes",
    sceneId: 1,
    startAddress: 21,
    endAddress: 24,
    channelPairs16Bit: [
      [1, 2],
      [3, 4],
    ],
    is16Bit: true,
    colorTempLow: 2800,
    colorTempHigh: 10000,
    manufacturerName: "Arri",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it displays fixture percentages, channel number, and fixture name", async () => {
    const { getByText } = render(
      <Fixture {...fixture} data-testid="fixture" />,
    );

    await waitFor(() => {
      expect(getByText("1")).toBeTruthy();
      expect(getByText("Fixture 1")).toBeTruthy();
      expect(getByText(/50%/)).toBeTruthy();
    });
  });

  test("it has a green border when not selected", () => {
    const { getByTestId } = render(<Fixture {...fixture} />);

    const component = getByTestId("parent-view");

    console.log(component);

    expect(component).toHaveStyle({ borderColor: "green" });
  });

  test("it has a gold border when selected", () => {});

  test("once manual values are entered, the details turn red", () => {});
});

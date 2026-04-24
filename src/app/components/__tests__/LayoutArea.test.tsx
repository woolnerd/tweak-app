/* eslint-disable import/first */
// @ts-nocheck
import { render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import ErrorBoundary from "react-native-error-boundary";

jest.mock("../../../db/client.ts");
jest.mock("../../store/useCompositeFixtureStore.ts");
jest.mock("../../store/useFixtureChannelSelectionStore.ts");
jest.mock("../../store/useManualFixtureStore.ts");
jest.mock("../../../models/scene-to-fixture-assignments");

import ScenesToFixtureAssignments from "../../../models/scene-to-fixture-assignments.ts";
import useCompositeFixtureStore from "../../store/useCompositeFixtureStore.ts";
import useFixtureChannelSelectionStore from "../../store/useFixtureChannelSelectionStore.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";
import LayoutArea from "../LayoutArea/LayoutArea.tsx";

if (typeof global.setImmediate === "undefined") {
  (global.setImmediate as unknown) = (fn, ...args) =>
    setTimeout(fn, 0, ...args);
}

describe("LayoutArea", () => {
  const mockCompositeFixtures = [
    {
      fixtureAssignmentId: 1,
      channel: 1,
      values: [
        [1, 100],
        [2, 255],
      ],
      title: "Fixture 1",
      profileChannels: {
        1: "intensity",
        2: "red",
        3: "green",
        4: "blue",
      },
      profileName: "Profile 1",
      fixtureName: "Fixture 1",
      fixtureNotes: "no notes",
      sceneId: 1,
      startAddress: 21,
      endAddress: 24,
      dbValues: [
        [1, 255],
        [2, 255],
      ],
    },
    {
      fixtureAssignmentId: 2,
      channel: 2,
      values: [
        [1, 100],
        [2, 255],
      ],
      title: "Fixture 2",
      profileChannels: {
        1: "intensity",
        2: "red",
        3: "green",
        4: "blue",
      },
      profileName: "Profile 1",
      fixtureName: "Fixture 2",
      fixtureNotes: "no notes",
      sceneId: 1,
      startAddress: 1,
      endAddress: 20,
      colorTempLow: 2800,
      colorTempHigh: 10000,
      dbValues: [
        [1, 255],
        [2, 255],
      ],
    },
  ];

  const mockManualFixtures = {
    1: { values: [[1, 255]] },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCompositeFixtureStore.mockReturnValue({
      compositeFixturesStore: mockCompositeFixtures,
      updateCompositeFixturesStore: jest.fn(),
    });

    useFixtureChannelSelectionStore.mockReturnValue({
      fixtureChannelSelectionStore: new Set(),
    });

    useManualFixtureStore.mockReturnValue({
      manualFixturesStore: mockManualFixtures,
      previousManualFixtureStore: {},
    });

    (ScenesToFixtureAssignments as jest.Mock).mockImplementation(() => ({
      getCompositeFixtureInfo: jest
        .fn()
        .mockResolvedValue(mockCompositeFixtures),
    }));
  });

  test("renders correctly", async () => {
    render(
      <ErrorBoundary>
        <LayoutArea
          selectedSceneId={1}
          loadFixtures
          setLoadFixtures={jest.fn}
        />
      </ErrorBoundary>,
    );

    await waitFor(() => {
      expect(screen.getByText("Fixture 1")).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText("Fixture 2")).toBeTruthy();
    });
  });

  test("fetch and update composite fixtures", async () => {
    const { updateCompositeFixturesStore } = useCompositeFixtureStore();
    render(
      <ErrorBoundary>
        <LayoutArea
          selectedSceneId={1}
          loadFixtures
          setLoadFixtures={jest.fn}
        />
      </ErrorBoundary>,
    );

    await waitFor(() =>
      expect(updateCompositeFixturesStore).toHaveBeenCalledWith(
        mockCompositeFixtures,
      ),
    );
  });
});

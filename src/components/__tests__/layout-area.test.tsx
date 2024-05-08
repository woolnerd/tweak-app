/* eslint-disable import/first */
import { render, waitFor } from "@testing-library/react-native";
import React from "react";

jest.mock("../../util/fixture-cache");
jest.mock("../../db/client.ts");
jest.mock("../../app/store/useCompositeFixtureStore.ts");
jest.mock("../../app/store/useFixtureChannelSelectionStore.ts");
jest.mock("../../app/store/useManualFixtureStore.ts");
jest.mock("../../models/scene-to-fixture-assignments");

import { useCompositeFixtureStore } from "../../app/store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../../app/store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../../app/store/useManualFixtureStore.ts";
import ScenesToFixtureAssignments from "../../models/scene-to-fixture-assignments.ts";
import LayoutArea from "../layout-area.tsx";

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
      addressStart: 1,
      addressEnd: 20,
      colorTempLow: 2800,
      colorTempHigh: 10000,
    },
  ];

  const mockManualFixtures = {
    1: { values: [[1, 255]] },
  };

  beforeEach(() => {
    // Clear all mocks before each test
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
    });

    (ScenesToFixtureAssignments as jest.Mock).mockImplementation(() => ({
      getCompositeFixtureInfo: jest
        .fn()
        .mockResolvedValue(mockCompositeFixtures),
    }));
  });

  test("renders correctly", async () => {
    const { getByText } = render(
      <LayoutArea selectedSceneId={1} goToOut={false} />,
    );

    await waitFor(() => {
      expect(getByText("Fixture 1")).toBeTruthy();
      expect(getByText("Fixture 2")).toBeTruthy();
    });
  });

  test("fetch and update composite fixtures", async () => {
    const { updateCompositeFixturesStore } = useCompositeFixtureStore();
    render(<LayoutArea selectedSceneId={1} goToOut={false} />);

    await waitFor(() =>
      expect(updateCompositeFixturesStore).toHaveBeenCalledWith(
        mockCompositeFixtures,
      ),
    );
  });

  test("merge manual and composite fixtures", async () => {
    const { updateCompositeFixturesStore } = useCompositeFixtureStore();
    render(<LayoutArea selectedSceneId={1} goToOut={false} />);

    await waitFor(() => {
      expect(updateCompositeFixturesStore).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            fixtureAssignmentId: 1,
            channel: 1,
            values: [
              [1, 100],
              [2, 255],
            ],
          }),
          expect.objectContaining({
            fixtureAssignmentId: 2,
            channel: 2,
            values: [
              [1, 100],
              [2, 255],
            ],
          }),
        ]),
      );
    });
  });
});

/* eslint-disable import/first */
import { render, waitFor } from "@testing-library/react-native";
import React from "react";

jest.mock("../../util/fixture-cache");
jest.mock("../../db/client.ts");

import ScenesToFixtureAssignments from "../../models/scene-to-fixture-assignments.ts";
import * as fixtureUtils from "../../util/fixture-cache.ts";
import LayoutArea from "../layout-area.tsx";

describe("LayoutArea", () => {
  // Setup common props to reuse
  const commonProps = { selectedSceneId: 1, goToOut: false };

  // Mock data to return from our mocked functions
  const mockFixtureResponse = [
    {
      fixtureAssignmentId: 1,
      channel: 1,
      values: JSON.stringify([
        [1, 100],
        [2, 255],
      ]),
      title: "Fixture 1",
      profileChannels: JSON.stringify({
        1: "intensity",
        2: "red",
        3: "green",
        4: "blue",
      }),
      profileName: "Profile 1",
      fixtureName: "Fixture 1",
      fixtureNotes: "no notes",
      sceneId: 1,
    },
    {
      fixtureAssignmentId: 2,
      channel: 2,
      values: JSON.stringify([
        [1, 100],
        [2, 255],
      ]),
      title: "Fixture 2",
      profileChannels: JSON.stringify({
        1: "intensity",
        2: "red",
        3: "green",
        4: "blue",
      }),
      profileName: "Profile 1",
      fixtureName: "Fixture 2",
      fixtureNotes: "no notes",
      sceneId: 1,
    },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup our mocks
    ScenesToFixtureAssignments.prototype.getCompositeFixtureInfo = jest
      .fn()
      .mockResolvedValue(mockFixtureResponse);
    (fixtureUtils.getManualFixtureKeys as jest.Mock) = jest
      .fn()
      .mockResolvedValue([
        "sceneId:1#fixtureAssignementId:1",
        "sceneId:1#fixtureAssignementId:2",
      ]);
    (fixtureUtils.getAllFixturesFromSceneKeys as jest.Mock) = jest
      .fn()
      .mockResolvedValue([
        {
          fixtureAssignmentId: 3,
          channel: 3,
          values: JSON.stringify([
            [1, 100],
            [2, 255],
          ]),
          title: "Fixture 1",
          profileChannels: JSON.stringify({
            1: "intensity",
            2: "red",
            3: "green",
            4: "blue",
          }),
          profileName: "Profile 1",
          fixtureName: "Fixture 3",
          fixtureNotes: "no notes",
          sceneId: 1,
        },
      ]);
  });

  it("renders correctly", async () => {
    const { getByText } = render(<LayoutArea {...commonProps} />);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(getByText("Fixture 1")).toBeTruthy();
      expect(getByText("Fixture 3")).toBeTruthy();
    });
  });
});

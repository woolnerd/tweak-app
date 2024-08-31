/* eslint-disable react/jsx-props-no-spreading */
// @ts-nocheck
import {
  render,
  screen,
  fireEvent,
  userEvent,
} from "@testing-library/react-native";
import React, { createRef } from "react";

import SceneModel from "../../../models/scene.ts";
import { useFixtureChannelSelectionStore } from "../../store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../../store/useManualFixtureStore.ts";
import { Scene } from "../Scene/Scene.tsx";
// Mock props
const mockProps = {
  id: 1,
  name: "Test Scene",
  timeRate: 5,
  showId: 1,
  order: 3,
  setSelectedSceneId: jest.fn(),
  selectedSceneId: 1,
  setReloadScenes: jest.fn(),
  labelRef: createRef(), // Mock or create a ref
};

const handleLabelScene = jest.fn();

const mockManualFixtures = {
  1: { values: [[1, 255]] },
};

jest.mock("../../../db/client.ts");
jest.mock("../../store/useManualFixtureStore.ts");
jest.mock("../../store/useFixtureChannelSelectionStore.ts");

beforeEach(() => {
  jest.clearAllMocks();
  useFixtureChannelSelectionStore.mockReturnValue({
    fixtureChannelSelectionStore: new Set(),
  });

  useManualFixtureStore.mockReturnValue({
    manualFixturesStore: mockManualFixtures,
  });
});

test("renders SceneComponent correctly", () => {
  const { getByText } = render(<Scene {...mockProps} />);

  expect(getByText(/Test Scene/i)).toBeTruthy();
  expect(getByText(/REC/i)).toBeTruthy();
});

test("labelRef is assigned correctly", () => {
  // const { root } = render(<Scene {...mockProps} />);
  // Check if labelRef is attached correctly
  // const labelElement = root.querySelector("labelRef"); // Adjust the selector as needed
  // expect(mockProps.labelRef.current).toBe(false);
});

test("handles label scene on long press", () => {
  const { getByText } = render(<Scene {...mockProps} />);

  const scenePressable = getByText(/Test Scene/i);

  fireEvent(scenePressable, "onLongPress");

  expect(screen.getByPlaceholderText(/New Label/i)).toBeTruthy();
});

test("calls setReloadScenes when appropriate", () => {});

test("updates scene label on enter button press", async () => {
  const user = userEvent.setup();

  SceneModel.prototype.update = jest.fn();
  render(<Scene {...mockProps} />);

  await user.longPress(screen.getByText(/Test Scene/i).parent);

  await user.type(screen.getByPlaceholderText(/New Label/i), "Hello World", {
    submitEditing: true,
  });
  screen.debug();

  expect(handleLabelScene).toHaveBeenCalled();
  expect(updateMock).toHaveBeenCalledWith({
    name: "Hello World",
    id: 1,
    order: 3,
    timeRate: 120,
    showId: 1,
  });
  expect(mockProps.setReloadScenes).toHaveBeenCalledWith(true);
});

import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";

import {
  Buttons,
  ProfileTarget,
  ControlButton,
} from "../../../lib/types/buttons.ts";
import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import ControlPanelButton from "../ControlPanelButton/ControlPanelButton.tsx";

const buildFixture = (
  overrides: Partial<ParsedCompositeFixtureInfo> = {},
): ParsedCompositeFixtureInfo => ({
  values: [[0, 255]],
  profileChannels: {
    1: "Dimmer",
    2: "Dimmer fine",
    3: "Color Temp",
    4: "Color Temp fine",
  },
  manufacturerName: "Manufacturer",
  colorTempLow: 2800,
  colorTempHigh: 10000,
  fixtureAssignmentId: 1,
  channel: 1,
  profileName: "",
  fixtureName: "",
  fixtureNotes: "",
  sceneId: 1,
  startAddress: 1,
  channelPairs16Bit: [[0, 1]],
  is16Bit: true,
  endAddress: 20,
  ...overrides,
});

describe("ControlPanelButton", () => {
  const handleTouchMock = jest.fn();

  const buttonData: ControlButton = {
    id: "button1",
    value: 2800,
    label: "2800",
    type: Buttons.DIRECT_ACTION_BUTTON,
    profileTarget: ProfileTarget.COLOR_TEMP,
    styles: { color: "orange" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render button with correct label", () => {
    render(
      <ControlPanelButton
        buttonData={buttonData}
        handleTouch={handleTouchMock}
        selectedFixtures={[]}
      />,
    );

    expect(screen.getByText("2800")).toBeTruthy();
  });

  it("should enable the button when a valid fixture is selected", () => {
    const selectedFixtures = [buildFixture({ colorTempLow: 2000 })];

    render(
      <ControlPanelButton
        buttonData={buttonData}
        handleTouch={handleTouchMock}
        selectedFixtures={selectedFixtures}
      />,
    );

    const button = screen.getByRole("button");
    const textNode = screen.getByText("2800");
    expect(button.props.accessibilityState.disabled).toBe(false);
    expect(textNode.props.style).toMatchObject({
      backgroundColor: "orange",
    });
  });

  it("should enable the button when no fixtures are selected", () => {
    render(
      <ControlPanelButton
        buttonData={buttonData}
        handleTouch={handleTouchMock}
        selectedFixtures={[]}
      />,
    );

    const button = screen.getByRole("button");
    const textNode = screen.getByText("2800");
    expect(button.props.accessibilityState.disabled).toBe(false);
    expect(textNode.props.style).toMatchObject({
      backgroundColor: "orange",
    });
  });

  it("should disable the button if the selected fixture has incompatible color temperature", () => {
    const selectedFixtures = [buildFixture({ colorTempLow: 3000 })]; // Set an incompatible color temp

    render(
      <ControlPanelButton
        buttonData={buttonData}
        handleTouch={handleTouchMock}
        selectedFixtures={selectedFixtures}
      />,
    );

    const button = screen.getByRole("button");
    expect(button.props.accessibilityState.disabled).toBe(true);
    expect(button.props.style).toMatchObject({ backgroundColor: "gray" });
  });

  it("should call handleTouch when button is pressed and enabled", () => {
    const selectedFixtures = [buildFixture({ colorTempLow: 2800 })];

    render(
      <ControlPanelButton
        buttonData={buttonData}
        handleTouch={handleTouchMock}
        selectedFixtures={selectedFixtures}
      />,
    );

    fireEvent.press(screen.getByRole("button"));
    expect(handleTouchMock).toHaveBeenCalledWith(buttonData);
  });

  it("should not call handleTouch when button is pressed and disabled", () => {
    render(
      <ControlPanelButton
        buttonData={buttonData}
        handleTouch={handleTouchMock}
        selectedFixtures={[buildFixture({ colorTempLow: 3000 })]}
      />,
    );

    fireEvent.press(screen.getByRole("button"));
    expect(handleTouchMock).not.toHaveBeenCalled();
  });
});

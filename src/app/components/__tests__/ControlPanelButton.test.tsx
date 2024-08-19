/* eslint-disable import/first */
// @ts-nocheck
import { render, waitFor } from "@testing-library/react-native";
import React from "react";

import { Buttons, ProfileTarget } from "../../../lib/types/buttons.ts";
import ControlPanelButton from "../ControlPanelButton/ControlPanelButton.tsx";

describe("ControlPanelButton", () => {
  test("renders correctly", async () => {
    const mockButtonData = {
      id: "button63",
      type: Buttons.DIRECT_ACTION_BUTTON,
      label: "5600",
      value: 5600,
      styles: { color: "blue" },
      profileTarget: ProfileTarget.COLOR_TEMP,
    };

    const { getByText } = render(
      <ControlPanelButton
        key={mockButtonData.id}
        buttonData={mockButtonData}
        handleTouch={() => null}
        allSelectionHasColorTemp={false}
        selectionColorTempMax={5000}
        selectionColorTempMin={2800}
        allSelectionHasTint={false}
      />,
    );

    await waitFor(() => {
      expect(getByText("5600")).toBeTruthy();
    });
  });
});

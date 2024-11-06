/* eslint-disable import/first */
// @ts-nocheck
import { render, waitFor } from "@testing-library/react-native";
import React from "react";

import { Buttons, ProfileTarget } from "../../../lib/types/buttons.ts";
import ControlPanelButton from "../ControlPanelButton/ControlPanelButton.tsx";

describe("ControlPanelButton", () => {
  test.skip("renders correctly", async () => {
    const mockButtonData = {
      id: "button63",
      type: Buttons.DIRECT_ACTION_BUTTON,
      label: "5600",
      value: 5600,
      styles: { color: "blue" },
      profileTarget: ProfileTarget.COLOR_TEMP,
    };
    const fixturesWithTintAndColorTemp: ParsedCompositeFixtureInfo[] = [
      {
        fixtureAssignmentId: 1,
        channel: 1,
        values: [
          [1, 179],
          [2, 51],
          [3, 156],
          [4, 1],
        ],
        title: "Vortex 1 at full",
        profileChannels: {
          "1": "Dimmer",
          "2": "Dimmer fine",
          "3": "Color Temp",
          "4": "Color Temp fine",
          "5": "Green/Magenta Point",
          "6": "Green/Magenta Point fine",
          "7": "Crossfade color",
          "8": "Crossfade color fine",
          "9": "Red intensity",
          "10": "Red intensity fine",
          "11": "Green intensity",
          "12": "Green intensity fine",
          "13": "Blue intensity",
          "14": "Blue intensity fine",
          "15": "White intensity",
          "16": "White intensity fine",
          "17": "Fan control",
          "18": "Preset",
          "19": "Strobe",
          "20": "Reserved for future use",
        },
        channelPairs16Bit: [
          [1, 2],
          [3, 4],
          [5, 6],
          [7, 8],
          [9, 10],
          [11, 12],
          [13, 14],
          [15, 16],
        ],
        is16Bit: true,
        profileName: "mode 6",
        fixtureName: "Vortex",
        fixtureNotes: "test",
        sceneId: 1,
        startAddress: 1,
        endAddress: 20,
        colorTempLow: 2200,
        colorTempHigh: 15000,
      },
      {
        fixtureAssignmentId: 3,
        channel: 10,
        values: [
          [1, 179],
          [2, 51],
          [3, 35],
          [4, 143],
        ],
        title: "S60 1 at 50%",
        profileChannels: {
          "1": "Dimmer",
          "2": "Dimmer fine",
          "3": "Color Temp",
          "4": "Color Temp fine",
          "5": "Green/Magenta Point",
          "6": "Green/Magenta Point fine",
          "7": "Crossfade color",
          "8": "Crossfade color fine",
          "9": "Red intensity",
          "10": "Red intensity fine",
          "11": "Green intensity",
          "12": "Green intensity fine",
          "13": "Blue intensity",
          "14": "Blue intensity fine",
          "15": "White intensity",
          "16": "White intensity fine",
          "17": "Fan control",
          "18": "Reserved for future use",
        },
        channelPairs16Bit: [
          [1, 2],
          [3, 4],
          [5, 6],
          [7, 8],
          [9, 10],
          [11, 12],
          [13, 14],
          [15, 16],
        ],
        is16Bit: true,
        profileName: "mode 6",
        fixtureName: "S60",
        fixtureNotes: "test",
        sceneId: 1,
        startAddress: 41,
        endAddress: 60,
        colorTempLow: 2800,
        colorTempHigh: 10000,
      },
    ];

    const { getByText } = render(
      <ControlPanelButton
        key={mockButtonData.id}
        buttonData={mockButtonData}
        handleTouch={() => null}
        selectedFixtures={fixturesWithTintAndColorTemp}
      />,
    );

    await waitFor(() => {
      expect(getByText("5600")).toBeTruthy();
    });
  });
});

/* eslint-disable testing-library/no-node-access */
/* eslint-disable global-require */
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import "@testing-library/react-native/extend-expect";
import React from "react";
import ErrorBoundary from "react-native-error-boundary";

import {
  AddressTuples,
  ParsedCompositeFixtureInfo,
} from "../../../models/types/scene-to-fixture-assignment.ts";
import App from "../../main/index.tsx";
import useCompositeFixtureStore from "../../store/useCompositeFixtureStore.ts";
import Fixture from "../Fixture/Fixture.tsx";

if (typeof global.setImmediate === "undefined") {
  (global.setImmediate as unknown) = (fn, ...args) =>
    setTimeout(fn, 0, ...args);
}

jest.mock("../../hooks/useInitialize.ts");
jest.mock("../../../models/scene-to-fixture-assignments.ts", () =>
  require("../../../models/__mocks__/scenes-to-fixture-assignments.ts"),
);
jest.mock("../../../models/scene.ts", () =>
  require("../../../models/__mocks__/scene.ts"),
);

const mockCompositeFixtures: ParsedCompositeFixtureInfo[] = [
  {
    fixtureAssignmentId: 1,
    channel: 1,
    values: [
      [1, 255],
      [2, 255],
    ],
    profileChannels: {
      1: "Dimmer",
      2: "Dimmer fine",
      3: "Color temp",
      4: "Color temp fine",
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
    manufacturerName: "arri",
    colorTempHigh: 10000,
    colorTempLow: 2800,
  },
  {
    fixtureAssignmentId: 2,
    channel: 2,
    values: [
      [1, 128],
      [2, 255],
    ],
    profileChannels: {
      1: "Dimmer",
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
    channelPairs16Bit: [],
    is16Bit: false,
    manufacturerName: "arri",
  },
  {
    fixtureAssignmentId: 3,
    channel: 3,
    values: [[1, 128]],
    profileChannels: {
      1: "Dimmer",
    },
    profileName: "",
    fixtureName: "Single Channel",
    fixtureNotes: "no notes",
    sceneId: 1,
    startAddress: 1,
    endAddress: 1,
    colorTempLow: -1,
    colorTempHigh: -1,
    channelPairs16Bit: [],
    is16Bit: false,
    manufacturerName: "generic",
  },
];

describe("Fixture component", () => {
  const fixture: ParsedCompositeFixtureInfo & { dbValues: AddressTuples } = {
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
    dbValues: [
      [1, 128],
      [2, 128],
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCompositeFixtureStore.setState({
      compositeFixturesStore: mockCompositeFixtures,
    });
  });

  test("it displays fixture percentages, channel number, and fixture name", async () => {
    render(<Fixture {...fixture} data-testid="fixture" />);

    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("Fixture 1")).toBeTruthy();
    expect(screen.getByText(/50%/)).toBeTruthy();
  });

  test("it has a green border when not selected", () => {
    render(<Fixture {...fixture} />);
    const component = screen.getByTestId("fixture-1");

    expect(component).toHaveStyle({ borderTopColor: "#22c55e" });
    expect(component).toHaveStyle({ borderRightColor: "#22c55e" });
    expect(component).toHaveStyle({ borderBottomColor: "#22c55e" });
    expect(component).toHaveStyle({ borderLeftColor: "#22c55e" });
  });

  test("it has a gold border when selected", () => {
    render(<Fixture {...fixture} />);
    const component = screen.getByTestId("fixture-1");

    fireEvent(component, "onTouchStart");

    expect(component).toHaveStyle({ borderTopColor: "#eab308" });
    expect(component).toHaveStyle({ borderRightColor: "#eab308" });
    expect(component).toHaveStyle({ borderBottomColor: "#eab308" });
    expect(component).toHaveStyle({ borderLeftColor: "#eab308" });
  });

  test("once manual values are entered in the ControlPanel, the details turn red", async () => {
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
    );
    const controlButton50Percent = screen.getByTestId("cp-button-50%");
    const controlButton5600 = screen.getByTestId("cp-button-5600");
    const fixtureElement = screen.getByTestId("fixture-1");

    fireEvent(fixtureElement, "onTouchStart");
    fireEvent.press(controlButton50Percent);
    fireEvent.press(controlButton5600);

    expect(screen.getAllByTestId("output-detail-1")[0]).toHaveStyle({
      color: "#dc2626",
    });

    expect(
      screen.getAllByTestId("output-detail-1")[0].children.join(" "),
    ).toContain("Dimmer");

    expect(
      screen.getAllByTestId("output-detail-1")[1].children.join(" "),
    ).toContain("5600");

    await waitFor(() => {
      expect(
        screen.getAllByTestId("output-detail-1")[1].children.join(" "),
      ).toContain("Color temp");
    });
  });
});

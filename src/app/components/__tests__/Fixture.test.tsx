if (typeof global.setImmediate === "undefined") {
  (global.setImmediate as unknown) = (fn, ...args) => {
    return setTimeout(fn, 0, ...args);
  };
}

// Mocking expo-sqlite/next
jest.mock("expo-sqlite/next", () => {
  return {
    openDatabaseSync: jest.fn(() => ({
      transaction: jest.fn((callback) => {
        const tx = {
          executeSql: jest.fn(
            (query, params, successCallback, errorCallback) => {
              // Provide a mocked result object, as required by your application
              if (successCallback) {
                successCallback({
                  rows: {
                    length: 0,
                    item: jest.fn(),
                    _array: [],
                  },
                });
              }
            },
          ),
        };
        callback(tx);
      }),
    })),
    prepareSync: jest.fn(), // Mocking prepareSync function
  };
});

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
];

// jest.mock("../../store/useCompositeFixtureStore", () => {
//   // const actualZustand = jest.requireActual("zustand");
//   return jest.fn(() => ({
//     compositeFixturesStore: mockCompositeFixtures,
//     updateCompositeFixturesStore: jest.fn(),
//   }));
// });

// jest.mock("../../store/useFixtureChannelSelectionStore", () => {
//   // const actualZustand = jest.requireActual("zustand");
//   return jest.fn(() => ({
//     fixtureChannelSelectionStore: new Set([-1]),
//     updatefixtureChannelSelectionStore: jest.fn(),
//   }));
// });

// jest.mock("../../store/useManualFixtureStore", () => {
//   // const actualZustand = jest.requireActual("zustand");
//   return jest.fn(() => ({
//     manualFixturesStore: {},
//     updateManualFixturesStore: jest.fn(),
//   }));
// });

import {
  render,
  waitFor,
  userEvent,
  fireEvent,
  screen,
  act,
  configure,
} from "@testing-library/react-native";
import "@testing-library/react-native/extend-expect";
// import "@testing-library/jest-dom";

import React from "react";
import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import Fixture from "../Fixture/Fixture.tsx";
import useCompositeFixtureStore from "../../store/useCompositeFixtureStore.ts";
import App from "../../main/index.tsx";
import ErrorBoundary from "react-native-error-boundary";
import { log } from "console";

jest.mock("../../hooks/useInitialize.ts");
// jest.mock("../../hooks/useCommandLineRouter.ts");
jest.mock("../../../models/scene-to-fixture-assignments.ts");
jest.mock("../../../models/scene", () => {
  return jest.fn().mockImplementation(() => ({
    getAllOrdered: jest.fn(() => Promise.resolve([])), // Mock the function to return a promise with empty data or desired test data
    handleError: jest.fn(),
  }));
});
// Mocking the module
// Mock the ScenesToFixtureAssignments class
jest.mock("../../../models/scene-to-fixture-assignments", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        getCompositeFixtureInfo: jest
          .fn()
          .mockResolvedValue(mockCompositeFixtures),
      };
    }),
  };
});

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
    useCompositeFixtureStore.setState({
      compositeFixturesStore: mockCompositeFixtures,
    });
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
    const component = getByTestId("fixture-1");
    expect(component).toHaveStyle({ borderColor: "rgb(100, 256, 100)" });
  });

  test("it has a gold border when selected", () => {
    const { getByTestId } = render(<Fixture {...fixture} />);
    const component = getByTestId("fixture-1");

    fireEvent(component, "onTouchStart");

    expect(component).toHaveStyle({ borderColor: "gold" });
  });

  test("once manual values are entered in the ControlPanel, the details turn red", async () => {
    const { getByTestId, debug } = render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
    );
    const controlButton = getByTestId("cp-button-50%");
    const fixture = getByTestId("fixture-1");
    // // await act(async () => {
    await act(async () => {
      fireEvent.press(fixture);
      fireEvent.press(controlButton);
    });
    // // });
    await waitFor(() => {
      const outputDetail = getByTestId("output-detail-1");
      console.log(outputDetail.props);

      expect(outputDetail.children.join(" ")).toContain("100%");
      expect(outputDetail).toHaveStyle({ color: "rgb(256, 50, 30)" });
    });
  });
});

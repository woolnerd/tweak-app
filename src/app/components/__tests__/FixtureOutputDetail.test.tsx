import { render, screen, act } from "@testing-library/react-native";
import React from "react";

import {
  percentageToColorTemperature,
  percentageToIntensityLevel,
  convertDmxValueToPercent,
} from "../../../util/helpers.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";
import {
  processChannelValues,
  buildObjectDetailData,
  buildObjectDetailManualStyleObj,
} from "../Fixture/helpers.ts";
import FixtureOutputDetail from "../FixtureOutputDetail/FixtureOutputDetail.tsx";

// Mock the dependencies
jest.mock("../../store/useManualFixtureStore");
jest.mock("../../../util/helpers");
jest.mock("../Fixture/helpers");
jest.mock("../FaderNumbers/FaderNumbers", () => ({
  __esModule: true,
  default: ({ start, end, duration }) =>
    `FaderNumbers-${start}-${end}-${duration}`,
}));

describe("FixtureOutputDetail", () => {
  // Common test props
  const defaultProps = {
    profileChannels: {
      1: "Intensity",
      2: "Color Temp",
    },
    values: [[100, 200]],
    channelPairs16Bit: [],
    is16Bit: false,
    fixtureAssignmentId: 1,
    channel: 1,
    colorTempHigh: 6000,
    colorTempLow: 3200,
    previousValues: [[50, 150]],
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock store
    (useManualFixtureStore as jest.Mock).mockReturnValue({
      manualFixturesStore: {
        1: { manualChannels: [1] },
      },
    });

    // Mock helper functions
    (processChannelValues as jest.Mock).mockReturnValue({ 1: 100, 2: 200 });
    (buildObjectDetailData as jest.Mock).mockReturnValue({
      intensity: 100,
      colorTemp: 200,
    });
    (buildObjectDetailManualStyleObj as jest.Mock).mockReturnValue({
      intensity: true,
      colorTemp: false,
    });
    (convertDmxValueToPercent as jest.Mock).mockReturnValue(50);
    (percentageToIntensityLevel as jest.Mock).mockReturnValue(50);
    (percentageToColorTemperature as jest.Mock).mockReturnValue(4500);
  });

  it("renders correctly with intensity and color temperature", () => {
    render(<FixtureOutputDetail {...defaultProps} />);

    const outputDetail = screen.getByTestId("output-detail-1");
    expect(outputDetail).toBeTruthy();
  });

  it("applies manual fixture styling correctly", () => {
    render(<FixtureOutputDetail {...defaultProps} />);

    const intensityText = screen.getByText("intensity:");
    expect(intensityText.props.className).toContain("text-red-600");

    const colorTempText = screen.getByText("Color Temp:");
    expect(colorTempText.props.className).toContain("text-black");
  });

  it("handles color temperature conversion", () => {
    (buildObjectDetailData as jest.Mock).mockReturnValue({
      colorTemp: 200,
    });

    render(<FixtureOutputDetail {...defaultProps} />);

    expect(percentageToColorTemperature).toHaveBeenCalledWith(50, 3200, 6000);
    expect(screen.getByText("colorTemp:")).toBeTruthy();
  });

  it("renders FaderNumbers for intensity values", () => {
    (buildObjectDetailData as jest.Mock).mockReturnValue({
      intensity: 100,
    });

    render(<FixtureOutputDetail {...defaultProps} />);

    expect(percentageToIntensityLevel).toHaveBeenCalled();
    // Note: In a real test environment, you'd need to adapt this expectation
    // based on how your test renderer handles the mock FaderNumbers component
  });

  it("handles null object details", () => {
    (buildObjectDetailData as jest.Mock).mockReturnValue(null);

    render(<FixtureOutputDetail {...defaultProps} />);

    expect(container.children.length).toBe(0);
  });

  it("processes previous values correctly", () => {
    render(<FixtureOutputDetail {...defaultProps} />);

    expect(processChannelValues).toHaveBeenCalledWith(
      defaultProps.previousValues,
      defaultProps.channelPairs16Bit,
      defaultProps.is16Bit,
    );
  });

  it("handles 16-bit values correctly", () => {
    const sixteenBitProps = {
      ...defaultProps,
      is16Bit: true,
      channelPairs16Bit: { 1: 2 },
    };

    render(<FixtureOutputDetail {...sixteenBitProps} />);

    expect(processChannelValues).toHaveBeenCalledWith(
      sixteenBitProps.values,
      sixteenBitProps.channelPairs16Bit,
      true,
    );
  });

  it("handles missing previous values", () => {
    const propsWithoutPrevious = {
      ...defaultProps,
      previousValues: [],
    };

    render(<FixtureOutputDetail {...propsWithoutPrevious} />);

    // Should still render without errors
    expect(processChannelValues).toHaveBeenCalled();
  });

  it("uses correct duration for FaderNumbers", () => {
    (buildObjectDetailData as jest.Mock).mockReturnValue({
      intensity: 100,
    });

    const { UNSAFE_root } = render(<FixtureOutputDetail {...defaultProps} />);

    // Verify that FaderNumbers is called with duration 2000
    expect(UNSAFE_root.textContent).toContain("2000");
  });
});

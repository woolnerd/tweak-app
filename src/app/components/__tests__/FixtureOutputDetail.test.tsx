/* eslint-disable testing-library/prefer-screen-queries */
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
import FixtureOutputDetail, {
  FixtureOutputDetailProps,
} from "../FixtureOutputDetail/FixtureOutputDetail.tsx";

jest.mock("../../store/useManualFixtureStore");
jest.mock("../../../util/helpers");
jest.mock("../Fixture/helpers");
jest.mock("../FaderNumbers/FaderNumbers", () => ({
  __esModule: true,
  default: ({ start, end, duration, displayString }) =>
    `FaderNumbers-${start}-${end}-${duration}-${displayString}`,
}));

describe("FixtureOutputDetail", () => {
  const defaultProps: FixtureOutputDetailProps = {
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
    jest.clearAllMocks();

    (useManualFixtureStore as unknown as jest.Mock).mockReturnValue({
      manualFixturesStore: {
        1: {
          manualChannels: [1],
          channel: 1,
          values: [
            [1, 255],
            [2, 255],
          ],
        },
      },
    });

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

  test("renders correctly with intensity and color temperature", () => {
    render(<FixtureOutputDetail {...defaultProps} />);

    const outputDetail = screen.getAllByTestId("output-detail-1")[0];
    expect(outputDetail).toBeTruthy();
  });

  test.skip("applies manual fixture styling correctly", () => {
    render(<FixtureOutputDetail {...defaultProps} />);

    const intensityText = screen.getByText("intensity:");
    expect(intensityText.props.className).toContain("text-red-600");

    const colorTempText = screen.getByText("Color Temp:");
    expect(colorTempText.props.className).toContain("text-black");
  });

  test.skip("handles color temperature conversion", () => {
    (buildObjectDetailData as jest.Mock).mockReturnValue({
      colorTemp: 50,
    });

    render(<FixtureOutputDetail {...defaultProps} />);

    expect(percentageToColorTemperature).toHaveBeenCalledWith(50, 3200, 6000);
    expect(screen.getByText("colorTemp:")).toBeTruthy();
  });

  test("renders FaderNumbers for intensity values", () => {
    (buildObjectDetailData as jest.Mock).mockReturnValue({
      intensity: 100,
    });

    render(<FixtureOutputDetail {...defaultProps} />);

    expect(percentageToIntensityLevel).toHaveBeenCalled();
  });

  test.skip("handles null object details", () => {
    (buildObjectDetailData as jest.Mock).mockReturnValue(null);

    const { getByTestId } = render(<FixtureOutputDetail {...defaultProps} />);

    expect(getByTestId("output-detail-1")).toBeFalsy();
  });

  test("processes previous values correctly", () => {
    render(<FixtureOutputDetail {...defaultProps} />);

    expect(processChannelValues).toHaveBeenCalledWith(
      defaultProps.previousValues,
      defaultProps.channelPairs16Bit,
      defaultProps.is16Bit,
    );
  });

  test("handles 16-bit values correctly", () => {
    const sixteenBitProps = {
      ...defaultProps,
      is16Bit: true,
      channelPairs16Bit: [[1, 2]],
    };

    render(<FixtureOutputDetail {...sixteenBitProps} />);

    expect(processChannelValues).toHaveBeenCalledWith(
      sixteenBitProps.values,
      sixteenBitProps.channelPairs16Bit,
      true,
    );
  });

  test.skip("handles missing previous values", () => {
    const propsWithoutPrevious = {
      ...defaultProps,
      previousValues: [],
    };

    render(<FixtureOutputDetail {...propsWithoutPrevious} />);

    expect(processChannelValues).toHaveBeenCalled();
  });

  test.skip("uses correct duration for FaderNumbers", () => {
    (buildObjectDetailData as jest.Mock).mockReturnValue({
      intensity: 100,
    });

    const { getAllByTestId } = render(
      <FixtureOutputDetail {...defaultProps} />,
    );

    screen.debug();
    expect(getAllByTestId("output-detail-1")[0].children[1]).toContain("2000");
  });
});

import {
  percentageToColorTemperature,
  percentageToIntensityLevel,
  convertDmxValueToPercent,
} from "../../../util/helpers.ts";

export const handleColorTempDisplay = (
  previousValue: number,
  profileValue: number,
  colorTempLow: number,
  colorTempHigh: number,
) => {
  const start = percentageToColorTemperature(
    convertDmxValueToPercent(previousValue),
    colorTempLow,
    colorTempHigh,
  );
  const end = percentageToColorTemperature(
    convertDmxValueToPercent(profileValue),
    colorTempLow,
    colorTempHigh,
  );

  return { start, end, duration: 2000 };
};

export const handleIntensityDisplay = (
  previousValue: number,
  profileValue: number,
) => {
  const start = percentageToIntensityLevel(
    convertDmxValueToPercent(previousValue),
  );
  const end = percentageToIntensityLevel(
    convertDmxValueToPercent(profileValue),
  );

  return { start, end, duration: 2000, displayString: "%" };
};

const isColorTempField = (
  colorTempLow: number,
  colorTempHigh: number,
  profileField: string,
) =>
  profileField.toLowerCase().includes("temp") && colorTempHigh && colorTempLow;

// only handles color temp and intensity right now, needs to handle tint, plus more
export const handleDifferentProfileFields = (
  profileField: string,
  details: Record<string, number>,
  previousDetails: Record<string, number>,
  colorTempLow: number,
  colorTempHigh: number,
) => {
  const profileValue = details[profileField];
  const previousValue = previousDetails[profileField] || 0; // if no starting value, start from 0

  if (isColorTempField(colorTempLow, colorTempHigh, profileField)) {
    return handleColorTempDisplay(
      previousValue,
      profileValue,
      colorTempLow,
      colorTempHigh,
    );
  }

  return handleIntensityDisplay(previousValue, profileValue);
};

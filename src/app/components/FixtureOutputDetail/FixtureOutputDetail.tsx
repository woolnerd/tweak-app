import { Text } from "react-native";

import {
  processChannelValues,
  buildObjectDetailData,
  buildObjectDetailManualStyleObj,
} from "../Fixture/helpers.ts";
import {
  percentageToColorTemperature,
  percentageToIntensityLevel,
  convertDmxValueToPercent,
} from "../../../util/helpers.ts";
import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";

type FixtureOutputDetailProps = {
  profileChannels: ParsedCompositeFixtureInfo["profileChannels"];
  values: ParsedCompositeFixtureInfo["values"];
  channelPairs16Bit: ParsedCompositeFixtureInfo["channelPairs16Bit"];
  is16Bit: boolean;
  fixtureAssignmentId: number;
  channel: number;
  colorTempHigh: ParsedCompositeFixtureInfo["colorTempHigh"];
  colorTempLow: ParsedCompositeFixtureInfo["colorTempLow"];
};

export function FixtureOutputDetail({
  profileChannels,
  values,
  channelPairs16Bit,
  is16Bit,
  fixtureAssignmentId,
  channel,
  colorTempHigh,
  colorTempLow,
}: FixtureOutputDetailProps) {
  const manualFixturesStore = useManualFixtureStore(
    (state) => state.manualFixturesStore,
  );

  const isManualFixtureChannel = (testChannel: number) =>
    !!manualFixturesStore[channel]?.manualChannels?.includes(testChannel);

  const fixtureTextDetailStyles = (profileBool: boolean) =>
    profileBool ? "text-red-600" : "text-black";

  const fixtureTextStyles = `text-center text-lg font-extrabold `;

  const isColorTempField = (
    colorTempLow: number,
    colorTempHigh: number,
    profileField: string,
  ) =>
    profileField.toLowerCase().includes("temp") &&
    colorTempHigh &&
    colorTempLow;

  // only handles color temp and intensity right now, needs to handle tint, plus more
  const handleDifferentProfileFields = (
    profileField: string,
    details: Record<string, number>,
  ) => {
    const profileValue = details[profileField];

    if (isColorTempField(colorTempLow, colorTempHigh, profileField)) {
      return percentageToColorTemperature(
        convertDmxValueToPercent(profileValue),
        colorTempLow,
        colorTempHigh,
      );
    }
    return `${percentageToIntensityLevel(convertDmxValueToPercent(profileValue))}%`;
  };

  const outputDetail = (
    profileField: string,
    details: Record<string, number>,
    styleOptions: Record<string, boolean>,
  ) => (
    <Text
      testID={`output-detail-${fixtureAssignmentId}`}
      key={String(fixtureAssignmentId).concat(profileField)}
      className={
        fixtureTextStyles + fixtureTextDetailStyles(styleOptions[profileField])
      }>
      {`${profileField}:
      ${details ? handleDifferentProfileFields(profileField, details) : ""}`}
    </Text>
  );

  const buildOutputDetails = () => {
    const processedChannelValues = processChannelValues(
      values,
      channelPairs16Bit,
      is16Bit,
    );

    const objectDetails = buildObjectDetailData(
      processedChannelValues,
      profileChannels,
    );

    const manualStyleChannels = buildObjectDetailManualStyleObj(
      processedChannelValues,
      profileChannels,
      isManualFixtureChannel,
    );

    if (!objectDetails) return null;

    return Object.keys(objectDetails).map((profileField) =>
      outputDetail(profileField, objectDetails, manualStyleChannels),
    );
  };

  return buildOutputDetails();
}

import { Text } from "react-native";
import { uniqueId } from "lodash";

import { handleChannelValues } from "../Fixture/helpers.ts";
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
  const buildOutputDetails = () => {
    const { result: details, manualStyleChannels } = handleChannelValues(
      profileChannels,
      values,
      channelPairs16Bit,
      is16Bit,
      isManualFixtureChannel,
    );

    if (!details) return null;

    return Object.keys(details as object).map((profileField) =>
      outputDetail(profileField, details, manualStyleChannels),
    );
  };

  const outputDetail = (
    profileField: string,
    details: Record<string, number>,
    styleOptions: Record<string, boolean>,
  ) => (
    <Text
      testID={`output-detail-${fixtureAssignmentId}`}
      key={uniqueId(String(fixtureAssignmentId))}
      className={
        fixtureTextStyles + fixtureTextDetailStyles(styleOptions[profileField])
      }>
      {`${profileField}:
      ${details ? handleDifferentProfileFields(profileField, details) : ""}`}
    </Text>
  );

  const isManualFixtureChannel = (testChannel: number) =>
    !!manualFixturesStore[channel]?.manualChannels?.includes(testChannel);

  const fixtureTextDetailStyles = (profileBool: boolean) =>
    profileBool ? "text-red-600" : "text-black";

  const fixtureTextStyles = `text-center text-lg font-extrabold `;

  // only handles color temp and intensity right now, needs to handle tint, plus more
  const handleDifferentProfileFields = (
    profileField: string,
    details: Record<string, number>,
  ) => {
    if (
      profileField.toLowerCase().includes("temp") &&
      colorTempHigh &&
      colorTempLow
    ) {
      return percentageToColorTemperature(
        convertDmxValueToPercent(details[profileField]),
        colorTempLow,
        colorTempHigh,
      );
    }
    return `${percentageToIntensityLevel(convertDmxValueToPercent(details[profileField]))}%`;
  };

  return buildOutputDetails();
}

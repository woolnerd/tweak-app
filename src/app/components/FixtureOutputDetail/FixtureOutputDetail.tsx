import { Text, View } from "react-native";
import { useRef, useEffect, useCallback } from "react";

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
import {
  AddressTuples,
  ParsedCompositeFixtureInfo,
} from "../../../models/types/scene-to-fixture-assignment.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";
import { cloneDeep, isUndefined } from "lodash";
import FaderNumbers from "../FaderNumbers/FaderNumbers.tsx";
import { log } from "console";

type FixtureOutputDetailProps = {
  profileChannels: ParsedCompositeFixtureInfo["profileChannels"];
  values: ParsedCompositeFixtureInfo["values"];
  channelPairs16Bit: ParsedCompositeFixtureInfo["channelPairs16Bit"];
  is16Bit: boolean;
  fixtureAssignmentId: number;
  channel: number;
  colorTempHigh: ParsedCompositeFixtureInfo["colorTempHigh"];
  colorTempLow: ParsedCompositeFixtureInfo["colorTempLow"];
  previousValues: AddressTuples;
  shouldFade: boolean;
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
  previousValues,
  shouldFade,
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
    previousDetails: Record<string, number>,
  ) => {
    const profileValue = details[profileField];
    const previousValue = previousDetails[profileField] || 0;

    if (isColorTempField(colorTempLow, colorTempHigh, profileField)) {
      return percentageToColorTemperature(
        convertDmxValueToPercent(profileValue),
        colorTempLow,
        colorTempHigh,
      );
    }

    const start = percentageToIntensityLevel(
      convertDmxValueToPercent(previousValue),
    );
    const end = percentageToIntensityLevel(
      convertDmxValueToPercent(profileValue),
    );

    if (channel === 1) {
      console.log({ start });
      console.log({ end });
    }

    return <FaderNumbers start={start} end={end} duration={2000} />;
  };

  const outputDetail = (
    profileField: string,
    details: Record<string, number>,
    previousDetails: Record<string, number>,
    styleOptions: Record<string, boolean>,
  ) => (
    <View key={String(fixtureAssignmentId).concat(profileField)}>
      <Text
        testID={`output-detail-${fixtureAssignmentId}`}
        key={String(fixtureAssignmentId).concat(profileField)}
        className={
          fixtureTextStyles +
          fixtureTextDetailStyles(styleOptions[profileField])
        }>
        {`${profileField}:`}
        {details
          ? handleDifferentProfileFields(profileField, details, previousDetails)
          : ""}
      </Text>
    </View>
  );

  const buildOutputDetails = () => {
    const processedChannelValues = processChannelValues(
      values,
      channelPairs16Bit,
      is16Bit,
    );

    const previousProcessedChannelValues = processChannelValues(
      previousValues,
      channelPairs16Bit,
      is16Bit,
    );

    const objectDetails = buildObjectDetailData(
      processedChannelValues,
      profileChannels,
    );

    const previousObjectDetails = buildObjectDetailData(
      previousProcessedChannelValues,
      profileChannels,
    );

    const manualStyleChannels = buildObjectDetailManualStyleObj(
      processedChannelValues,
      profileChannels,
      isManualFixtureChannel,
    );

    if (!objectDetails) return null;

    return Object.keys(objectDetails).map((profileField) =>
      outputDetail(
        profileField,
        objectDetails,
        previousObjectDetails,
        manualStyleChannels,
      ),
    );
  };

  return buildOutputDetails();
}

import { Text, View } from "react-native";

import { handleDifferentProfileFields } from "./helpers.ts";
import {
  AddressTuples,
  ParsedCompositeFixtureInfo,
} from "../../../models/types/scene-to-fixture-assignment.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";
import FaderNumbers from "../FaderNumbers/FaderNumbers.tsx";
import {
  processChannelValues,
  buildObjectDetailData,
  buildObjectDetailManualStyleObj,
} from "../Fixture/helpers.ts";

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
};

export default function FixtureOutputDetail({
  profileChannels,
  values,
  channelPairs16Bit,
  is16Bit,
  fixtureAssignmentId,
  channel,
  colorTempHigh,
  colorTempLow,
  previousValues,
}: FixtureOutputDetailProps) {
  const manualFixturesStore = useManualFixtureStore(
    (state) => state.manualFixturesStore,
  );

  const isManualFixtureChannel = (testChannel: number) =>
    !!manualFixturesStore[channel]?.manualChannels?.includes(testChannel);

  const fixtureTextDetailStyles = (profileBool: boolean) =>
    profileBool ? "text-red-600" : "text-black";

  const fixtureTextStyles = `text-center text-lg font-extrabold `;

  const handleOutputValue = (
    details: Record<string, number>,
    previousDetails: Record<string, number>,
    profileField: string,
  ) => {
    const detailProps = handleDifferentProfileFields(
      profileField,
      details,
      previousDetails,
      colorTempLow,
      colorTempHigh,
    );

    return <FaderNumbers {...detailProps} />;
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
        {handleOutputValue(details, previousDetails, profileField)}
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

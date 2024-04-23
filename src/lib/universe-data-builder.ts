/* eslint-disable spaced-comment */
import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";
import ChannelNumber from "../util/channel-number.ts";
import DmxValue from "../util/dmx-value.ts";

type UniverseDataObject = Record<number, number[]>;

export default class UniverseDataBuilder {
  private data: ParsedCompositeFixtureInfo;

  constructor(data: ParsedCompositeFixtureInfo) {
    this.data = data;
  }

  toUniverseObject() {
    const uniObj: UniverseDataObject = {};
    if (!this.data.addressStart || !this.data.addressEnd || !this.data.values) {
      throw new Error("Address start cannot be null");
    }

    uniObj[this.data.addressStart] = [];

    const addressFootprint = this.data.addressEnd - this.data.addressStart + 1;

    for (let i = 0; i < addressFootprint; i += 1) {
      uniObj[this.data.addressStart][i] = 0;
    }

    this.data.values.forEach((tuple) => {
      const [addressIdx, dmxValue] = tuple;
      uniObj[this.data.addressStart!][addressIdx - 1] = dmxValue;
    });

    return uniObj;
  }

  toUniverseTuples() {
    if (!this.data.addressStart || !this.data.values) {
      throw new Error("Starting addresss cannot be null");
    }

    return this.data.values?.map((tuple) => {
      const channelValue = UniverseDataBuilder.offsetByOneAndZeroIndex(
        tuple[0] + this.data.addressStart!,
      );
      const channel = new ChannelNumber(channelValue);
      const dmxValue = new DmxValue(tuple[1]);

      return [channel.value, dmxValue.value];
    });
  }

  static zeroIndex(value: number) {
    return value - 1;
  }

  static offsetByOneAndZeroIndex(value: number) {
    return value - 2;
  }
}

import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";
import ChannelNumber from "../util/channel-number.ts";
import DmxValue from "../util/dmx-value.ts";

type UniverseDataObject = Record<number, number[]>;
type UniverseDataObjectCollection = Record<number, number[][]>;

export default class UniverseDataBuilder {
  UNIVERSE_SIZE: number = 511;

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

  buildUniverses() {
    if (!this.data.addressStart || !this.data.values) {
      throw new Error("Starting addresss cannot be null");
    }

    return this.data.values?.reduce(
      (universes: UniverseDataObjectCollection, [orignalAddress, dmxVal]) => {
        if (!this.data.addressStart) {
          throw new Error("Addres start cannot be falsy");
        }
        const channelValue = UniverseDataBuilder.offsetByOneAndZeroIndex(
          orignalAddress + this.data.addressStart,
        );

        const universeNum = this.deriveUniverseFromAddress(
          this.data.addressStart,
        );

        const channel = new ChannelNumber(
          this.clampAddressToUniverseSize(channelValue),
        );
        const dmxValue = new DmxValue(dmxVal);

        if (universeNum in universes) {
          universes[universeNum].push([channel.value, dmxValue.value]);
        } else {
          universes[universeNum] = [[channel.value, dmxValue.value]];
        }
        return universes;
      },
      {},
    );
  }

  deriveUniverseFromAddress(startAddress: number) {
    return Math.ceil(startAddress / this.UNIVERSE_SIZE);
  }

  clampAddressToUniverseSize(startAddress: number) {
    return startAddress % this.UNIVERSE_SIZE;
  }

  static mergeUniverseData(arrayOfUniObjs: UniverseDataObjectCollection[]) {
    return arrayOfUniObjs.reduce(
      (
        universeAccum: UniverseDataObjectCollection,
        universe: UniverseDataObjectCollection,
      ) => {
        const uniNum = Number(Object.keys(universe)[0]);

        if (uniNum in universeAccum) {
          universeAccum[uniNum].push(...universe[uniNum]);
        } else {
          universeAccum[uniNum] = universe[uniNum];
        }
        return universeAccum;
      },
      {},
    );
  }

  static zeroIndex(value: number) {
    return value - 1;
  }

  static offsetByOneAndZeroIndex(value: number) {
    return value - 2;
  }
}

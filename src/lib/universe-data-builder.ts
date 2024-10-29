import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";
import ChannelNumber from "../util/channel-number.ts";
import DmxValue from "../util/dmx-value.ts";

export type UniverseDataObject = Record<number, number[]>;
export type UniverseDataObjectCollection = Record<number, number[][]>;

export type PickFixtureInfo = Pick<
  ParsedCompositeFixtureInfo,
  "startAddress" | "endAddress" | "values"
>;

export default class UniverseDataBuilder {
  UNIVERSE_SIZE: number = 511;

  private data: PickFixtureInfo;

  constructor(data: PickFixtureInfo) {
    this.data = data;
  }

  public buildUniverses() {
    return this.data.values?.reduce(
      (universes: UniverseDataObjectCollection, [originalAddress, dmxVal]) => {
        if (!this.data.startAddress) {
          throw new Error("Address start cannot be falsy");
        }
        const channelValue = UniverseDataBuilder.offsetByOneAndZeroIndex(
          originalAddress + this.data.startAddress,
        );
        const universeNum = this.deriveUniverseFromAddress(
          this.data.startAddress,
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

  public deriveUniverseFromAddress(startAddress: number) {
    return Math.ceil(startAddress / this.UNIVERSE_SIZE);
  }

  public clampAddressToUniverseSize(startAddress: number) {
    return startAddress % (this.UNIVERSE_SIZE + 1);
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

  static mapAddresses(channelOutputTuples: number[][]) {
    return channelOutputTuples.reduce(
      (acc, tuple) => {
        const [address, outputValue] = tuple;
        acc[address] = outputValue;
        return acc;
      },
      {} as Record<number, number>,
    );
  }

  static fillUniverseOutputValuesWithZero(channelOutputTuples: number[][]) {
    const universe: number[] = [];
    const addressMap = UniverseDataBuilder.mapAddresses(channelOutputTuples);

    for (let i = 0; i < 511; i += 1) {
      if (i in addressMap) {
        universe.push(addressMap[i]);
      } else {
        universe.push(0);
      }
    }

    return universe;
  }
}

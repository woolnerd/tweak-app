import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";
import ChannelNumber from "../util/channel-number.ts";
import DmxValue from "../util/dmx-value.ts";

type COARSE_16_BIT_CHANNEL = 0;
type FINE_16_BIT_CHANNEL = 1;
type COARSE_8_BIT_CHANNEL = -1;

type Determine16Bit =
  | COARSE_16_BIT_CHANNEL
  | FINE_16_BIT_CHANNEL
  | COARSE_8_BIT_CHANNEL;
export type ChannelValueAnd16BitIndicator = [number, number, Determine16Bit];

export type UniverseDataObject = Record<number, number[]>;
export type UniverseDataObjectCollection = Record<
  number,
  ChannelValueAnd16BitIndicator[]
>;

export type PickFixtureInfo = Pick<
  ParsedCompositeFixtureInfo,
  "startAddress" | "endAddress" | "values" | "channelPairs16Bit"
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
          universes[universeNum].push([
            channel.value,
            dmxValue.value,
            this.determineCoarseOrFineChannel(originalAddress),
          ]);
        } else {
          universes[universeNum] = [
            [
              channel.value,
              dmxValue.value,
              this.determineCoarseOrFineChannel(originalAddress),
            ],
          ];
        }
        return universes;
      },
      {},
    );
  }

  private determineCoarseOrFineChannel(channelValue: number): Determine16Bit {
    const coercedChannelValue = this.clampAddressToUniverseSize(channelValue);
    const coarse16BitChannel = 0;
    const fine16BitChannel = 1;
    const coarse8BitChannel = -1;

    for (let i = 0; i < this.data.channelPairs16Bit.length; i += 1) {
      const [coarse, fine] = this.data.channelPairs16Bit[i];

      if (coarse === coercedChannelValue) return coarse16BitChannel;
      if (fine === coercedChannelValue) return fine16BitChannel;
    }
    return coarse8BitChannel;
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

/* eslint-disable spaced-comment */
import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment";

type UniverseDataObject = Record<number, number[]>;

export default class UniverseDataBuilder {
  private data: ParsedCompositeFixtureInfo;

  toUniverseObject() {
    const uniObj: UniverseDataObject = {};
    if (!this.data.addressStart || !this.data.addressEnd || !this.data.values) {
      throw new Error("Address start cannot be null");
    }

    uniObj[this.data.addressStart] = [];

    for (let i = 0; i < this.data.addressEnd; i += 1) {
      uniObj[this.data.addressStart][i] = 0;
    }

    this.data.values.forEach((tuple) => {
      const [addressIdx, dmxValue] = tuple;
      uniObj[this.data.addressStart!][addressIdx - 1] = dmxValue;
    });

    return uniObj;
  }
}

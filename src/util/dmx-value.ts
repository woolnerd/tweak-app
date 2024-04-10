import RangedValue from "./ranged-value.ts";
export default class DmxValue extends RangedValue {
  constructor(value: number) {
    const LOW_DMX_BOUND = 0;
    const HIGH_DMX_BOUND = 255;

    super(value, LOW_DMX_BOUND, HIGH_DMX_BOUND);
  }
}

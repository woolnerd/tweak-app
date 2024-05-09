import { create } from "zustand";

import { DmxTuple } from "../../util/value-universe.ts";

type State = { outputValuesStore: DmxTuple[] };

type Action = {
  updateOutputValuesStore: (outputValuesStore: DmxTuple[]) => void;
};

// eslint-disable-next-line import/prefer-default-export
export const useOutputValuesStore = create<State & Action>((set) => ({
  outputValuesStore: [],
  updateOutputValuesStore: (outputValuesStore: DmxTuple[]) =>
    set(() => ({ outputValuesStore })),
}));

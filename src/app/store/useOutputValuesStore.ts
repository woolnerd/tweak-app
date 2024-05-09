import { create } from "zustand";

import { UniverseDataObjectCollection } from "../../lib/universe-data-builder.ts";

type State = { outputValuesStore: UniverseDataObjectCollection };

type Action = {
  updateOutputValuesStore: (
    outputValuesStore: UniverseDataObjectCollection,
  ) => void;
};

// eslint-disable-next-line import/prefer-default-export
export const useOutputValuesStore = create<State & Action>((set) => ({
  outputValuesStore: {},
  updateOutputValuesStore: (outputValuesStore: UniverseDataObjectCollection) =>
    set(() => ({ outputValuesStore })),
}));

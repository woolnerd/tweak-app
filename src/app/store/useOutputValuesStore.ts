import { create } from "zustand";

import { UniverseDataObjectCollection } from "../../lib/universe-data-builder.ts";

type State = {
  outputValuesStore: UniverseDataObjectCollection;
};

type Action = {
  updateOutputValuesStore: (
    outputValuesStore: UniverseDataObjectCollection,
  ) => void;
};

export default create<State & Action>((set) => ({
  outputValuesStore: {},
  updateOutputValuesStore: (outputValuesStore: UniverseDataObjectCollection) =>
    set(() => ({
      outputValuesStore,
    })),
}));

import { create } from "zustand";

import { ManualFixtureState } from "../components/Fixture/types/Fixture.ts";

type State = {
  manualFixturesStore: ManualFixtureState;
  previousManualFixtureStore: ManualFixtureState;
};

type Action = {
  updateManualFixturesStore: (manualFixturesStore: ManualFixtureState) => void;
};

export default create<State & Action>((set, get) => ({
  manualFixturesStore: {},
  previousManualFixtureStore: {},

  updateManualFixturesStore: (manualFixturesStore: ManualFixtureState) => {
    set(() => {
      const previousManualFixtureStore = get().manualFixturesStore;

      return {
        previousManualFixtureStore,
        manualFixturesStore,
      };
    });
  },
}));

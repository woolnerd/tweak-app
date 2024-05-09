import { create } from "zustand";

import { ManualFixtureState } from "../components/Fixture/types/Fixture.ts";

type State = { manualFixturesStore: ManualFixtureState };

type Action = {
  updateManualFixturesStore: (manualFixtureStore: ManualFixtureState) => void;
};

// eslint-disable-next-line import/prefer-default-export
export const useManualFixtureStore = create<State & Action>((set) => ({
  manualFixturesStore: {},
  updateManualFixturesStore: (manualFixturesStore: ManualFixtureState) =>
    set(() => ({ manualFixturesStore })),
}));

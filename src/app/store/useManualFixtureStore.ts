import { create } from "zustand";

import { ManualFixtureState } from "../../components/types/fixture.ts";

type State = { manualFixtures: ManualFixtureState[] };

type Action = {
  updateManualFixtures: (compositeFixturesStore: ManualFixtureState[]) => void;
};

// eslint-disable-next-line import/prefer-default-export
export const useManualFixtureStore = create<State & Action>((set) => ({
  manualFixtures: [],
  updateManualFixtures: (manualFixtures: ManualFixtureState[]) =>
    set(() => ({ manualFixtures })),
}));

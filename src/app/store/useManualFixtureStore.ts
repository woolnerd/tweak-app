import { create } from "zustand";

import { ManualFixtureState } from "../components/Fixture/types/Fixture.ts";

type State = { manualFixturesStore: ManualFixtureState };

type Action = {
  updateManualFixturesStore: (manualFixtureStore: ManualFixtureState) => void;
};

export default create<State & Action>((set) => ({
  manualFixturesStore: {},
  updateManualFixturesStore: (manualFixturesStore: ManualFixtureState) =>
    set(() => ({ manualFixturesStore })),
}));

import { create } from "zustand";

import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";

type State = { compositeFixturesStore: ParsedCompositeFixtureInfo[] };

type Action = {
  updateCompositeFixturesStore: (
    compositeFixturesStore: ParsedCompositeFixtureInfo[],
  ) => void;
};

export default create<State & Action>((set) => ({
  compositeFixturesStore: [],
  updateCompositeFixturesStore: (
    compositeFixturesStore: ParsedCompositeFixtureInfo[],
  ) => set(() => ({ compositeFixturesStore })),
}));

import { create } from "zustand";

import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";

type State = { compositeFixturesStore: ParsedCompositeFixtureInfo[] };

type Action = {
  updateCompositeFixturesStore: (
    compositeFixturesStore: ParsedCompositeFixtureInfo[],
  ) => void;
};

// eslint-disable-next-line import/prefer-default-export
export const useCompositeFixtureStore = create<State & Action>((set) => ({
  compositeFixturesStore: [],
  updateCompositeFixturesStore: (
    compositeFixturesStore: ParsedCompositeFixtureInfo[],
  ) => set(() => ({ compositeFixturesStore })),
}));

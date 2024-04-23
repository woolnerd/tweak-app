import { create } from "zustand";

import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";

type State = { compositeFixtures: ParsedCompositeFixtureInfo[] };

type Action = {
  updateCompositeFixtures: (
    compositeFixtures: ParsedCompositeFixtureInfo[],
  ) => void;
};

// eslint-disable-next-line import/prefer-default-export
export const useCompositeFixtureStore = create<State & Action>((set) => ({
  compositeFixtures: [],
  updateCompositeFixtures: (compositeFixtures: ParsedCompositeFixtureInfo[]) =>
    set(() => ({ compositeFixtures })),
}));

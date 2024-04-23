import { create } from "zustand";

// Drizzle inArray method must have at least one value in the array.
// using -1, because we should never have that id.
const DRIZZLE_ARRAY_CHECK_VALUE = -1;

type State = { fixtureChannelNumbers: Set<number> };

type Action = {
  updateFixtureSelection: (fixtureChannelNumbers: Set<number>) => void;
};

// eslint-disable-next-line import/prefer-default-export
export const useFixtureChannelSelectionStore = create<State & Action>(
  (setCallback) => ({
    fixtureChannelNumbers: new Set([DRIZZLE_ARRAY_CHECK_VALUE]),
    updateFixtureSelection: (fixtureChannelNumbers: Set<number>) =>
      setCallback(() => ({ fixtureChannelNumbers })),
  }),
);

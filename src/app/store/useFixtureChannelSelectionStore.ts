import { create } from "zustand";

// Drizzle inArray method must have at least one value in the array.
// using -1, because we should never have that id.
const DRIZZLE_ARRAY_CHECK_VALUE = -1;

type State = { fixtureChannelSelectionStore: Set<number> };

type Action = {
  updateFixtureChannelSelectionStore: (
    fixtureChannelSelectionStore: Set<number>,
  ) => void;
};

export default create<State & Action>((setCallback) => ({
  fixtureChannelSelectionStore: new Set([DRIZZLE_ARRAY_CHECK_VALUE]),
  updateFixtureChannelSelectionStore: (
    fixtureChannelSelectionStore: Set<number>,
  ) => setCallback(() => ({ fixtureChannelSelectionStore })),
}));

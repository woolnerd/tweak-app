import { create } from "zustand";
import { ManualFixtureState } from "../components/Fixture/types/Fixture.ts"; // Make sure this import is correct

type State = {
  manualFixturesStore: ManualFixtureState;
  previousManualFixtureStore: ManualFixtureState; // Store for the previous state
};

type Action = {
  updateManualFixturesStore: (manualFixturesStore: ManualFixtureState) => void;
};

export default create<State & Action>((set, get) => ({
  manualFixturesStore: {},
  previousManualFixtureStore: {}, // Initialize previous store as an empty object

  updateManualFixturesStore: (manualFixturesStore: ManualFixtureState) => {
    set(() => {
      // Capture the current state as previousStore before updating
      const previousManualFixtureStore = get().manualFixturesStore;

      // Return updated state with previousStore
      return {
        previousManualFixtureStore, // Save the current state to previousStore
        manualFixturesStore, // Set the new state
      };
    });
  },
}));

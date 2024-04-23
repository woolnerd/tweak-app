import { FixtureControlData } from "../components/types/fixture.ts";
import { DirectActionButton } from "../db/button-data.ts";

export default class DirectAction {
  protected buttonData: DirectActionButton;

  protected selectedFixtures: FixtureControlData[];

  constructor(
    buttonData: DirectActionButton,
    selectedFixtures: FixtureControlData[],
  ) {
    this.buttonData = buttonData;
    this.selectedFixtures = selectedFixtures;
  }

  private handleIntensity() {
    this.buttonData.value;
  }
}

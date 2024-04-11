import { FixtureControlData } from "../components/types/fixture.ts";
import { DirectActionButton } from "../db/button-data.ts";

export default class DirectAction {
  protected buttonData: DirectActionButton;

  protected selectedFixtures: FixtureControlData[];

  protected handleChannelValues: () => any;

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

  private function handleChannelValues(
    profileChannels: string,
    values: string,
  ): string | null {
    if (!profileChannels || !values) {
      return null;
    }

    const parsedProfileChannels: Channels = JSON.parse(profileChannels);
    const parsedValues: number[][] = JSON.parse(values);

    const output: string[] = [];

    parsedValues.forEach((value) => {
      const [key, outputVal] = value;
      // output.push([parsedProfileChannels[key], outputVal]);
      output.push(`${Math.trunc((outputVal / 255) * 100)}%`);
    });

    return output[0];
  }
}

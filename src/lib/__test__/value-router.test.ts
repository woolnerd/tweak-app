import ProfileAdapter from "../adapters/profile-adapter.ts";
import { ActionObject } from "../command-line/types/command-line-types.ts";
import { ProfileTarget } from "../types/buttons.ts";
import ValueRouter from "../value-router.ts";

describe("ValueRouter Tests", () => {
  test("value router initialization", () => {
    const profile = { 1: "DIMMER" };
    const profileAdapter = new ProfileAdapter("DIMMER", profile);
    const actionObject: ActionObject = {
      selection: [1],
      directive: 50,
      profileTarget: ProfileTarget.DIMMER,
      complete: false,
    };
    const valueRouter = new ValueRouter(actionObject, profileAdapter);
    expect(valueRouter.profileAdapter).toBe(profileAdapter);
    expect(valueRouter.actionObject).toBe(actionObject);
    expect(valueRouter.channels).toEqual([["1", "DIMMER"]]);
  });

  test("build result error handling", () => {
    const profile = { 1: "DIMMER" };
    const profileAdapter = new ProfileAdapter("DIMMER", profile);
    const actionObject: ActionObject = {
      selection: [1],
      directive: 5000,
      profileTarget: ProfileTarget.COLOR_TEMP,
      complete: false,
    };
    const valueRouter = new ValueRouter(actionObject, profileAdapter);
    valueRouter.channels = []; // Force an unsupported channel configuration

    expect(() => valueRouter.buildResult()).toThrow("Could not route Values");
  });

  describe("Constructor and Color Temperature Conversion", () => {
    it("constructor initialization and color temp conversion", () => {
      const profile = { 1: "COLOR TEMP" };
      const actionObject: ActionObject = {
        selection: [1],
        directive: 5000,
        profileTarget: ProfileTarget.COLOR_TEMP,
        complete: true,
      };
      const profileAdapter = new ProfileAdapter("COLOR TEMP", profile);
      const router = new ValueRouter(actionObject, profileAdapter);

      expect(router.channels).toEqual([["1", "COLOR TEMP"]]);
      expect(actionObject.directive).toBe(30.56);
    });
  });

  describe("Mutate or Merge Fixture Channels", () => {
    const profile = { 1: "DIMMER" };
    const actionObject: ActionObject = {
      selection: [1],
      directive: 100,
      profileTarget: ProfileTarget.DIMMER,
      complete: true,
    };
    const profileAdapter = new ProfileAdapter("DIMMER", profile);
    const router = new ValueRouter(actionObject, profileAdapter);
    test("mutate behavior", () => {
      router.channelTuples = [[1, 255]];

      const fixture = {
        values: [
          [1, 0],
          [2, 0],
        ],
      };
      router.mutateOrMergeFixtureChannels(fixture);

      expect(fixture.values).toEqual([
        [1, 255],
        [2, 0],
      ]);
    });
    test("merge behavior", () => {
      router.channelTuples = [[1, 255]];
      const fixture = {
        values: [
          [2, 255],
          [3, 0],
        ],
      };
      router.mutateOrMergeFixtureChannels(fixture);

      expect(fixture.values).toEqual([
        [1, 255],
        [2, 255],
        [3, 0],
      ]);
    });
  });
});

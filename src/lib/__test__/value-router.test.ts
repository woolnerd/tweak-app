import { ManualFixtureState } from "../../components/types/fixture.ts";
import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";
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

    test("setUpManualFixture", () => {
      const router = new ValueRouter(actionObject, profileAdapter);
      const fixture: ParsedCompositeFixtureInfo = {
        values: [[1, 255]],
        channelPairs16Bit: [[1, 2]],
        fixtureAssignmentId: 1,
        channel: 1,
      };
      const manualFixtureStateObj: ManualFixtureState = {
        1: {
          values: [
            [1, 0],
            [2, 0],
          ],
          fixtureAssignmentId: 1,
          channel: 1,
          manualChannels: [1, 2],
        },
      };

      // eslint-disable-next-line dot-notation
      router["setUpManualFixture"](fixture, manualFixtureStateObj);
    });

    test("mutateOrMergeOutputValues", () => {});
    test("mutate behavior", () => {
      router.channelTuples = [[1, 255]];

      const fixture: ParsedCompositeFixtureInfo = {
        values: [[1, 255]],
        channelPairs16Bit: [[1, 2]],
        fixtureAssignmentId: 1,
        channel: 1,
      };

      const manualFixtureStateObj: ManualFixtureState = {
        1: {
          values: [
            [1, 0],
            [2, 0],
          ],
          fixtureAssignmentId: 1,
          channel: 1,
          manualChannels: [1, 2],
        },
      };
      router.createManualFixtureObj(fixture, manualFixtureStateObj);

      expect(manualFixtureStateObj[1].values).toEqual([
        [1, 255],
        [2, 0],
      ]);
    });
    test("merge behavior", () => {
      router.channelTuples = [[1, 255]];

      const fixture: ParsedCompositeFixtureInfo = {
        values: [[1, 255]],
        channelPairs16Bit: [[1, 2]],
        fixtureAssignmentId: 1,
        channel: 1,
      };
      const manualFixtureStateObj = {
        values: [
          [2, 255],
          [3, 0],
        ],
        fixtureAssignmentId: 1,
        channel: 1,
        manualChannels: [2, 3],
      };
      router.createManualFixtureObj(fixture, manualFixtureStateObj);

      expect(manualFixtureStateObj.values).toEqual([
        [1, 255],
        [2, 255],
        [3, 0],
      ]);
    });
  });

  describe("parses channels appropriately", () => {
    const profile16bit = {
      1: "Dimmer",
      2: "Dimmer fine",
      3: "Color Temp",
      4: "Color temp fine",
    };
    const profile8bit = {
      1: "Dimmer",
      2: "Color Temp",
    };
    const actionObject: ActionObject = {
      selection: [1],
      directive: 100,
      profileTarget: ProfileTarget.DIMMER,
      complete: true,
    };
    let profileAdapter = new ProfileAdapter("DIMMER", profile16bit);
    let router = new ValueRouter(actionObject, profileAdapter);

    test("Parses 16-bit channels", () => {
      profileAdapter = new ProfileAdapter("DIMMER", profile16bit);
      router = new ValueRouter(actionObject, profileAdapter);
      expect(router.channelIs16Bit()).toBe(true);
      expect(router.channelIs8Bit()).toBe(false);
      router.buildResult();
      expect(router.parse16BitChannels()).toStrictEqual([
        [1, 255],
        [2, 255],
      ]);
    });

    test("Parses 8-bit channels", () => {
      profileAdapter = new ProfileAdapter("DIMMER", profile8bit);
      router = new ValueRouter(actionObject, profileAdapter);
      expect(router.channelIs16Bit()).toBe(false);
      expect(router.channelIs8Bit()).toBe(true);
      router.buildResult();

      expect(router.parse8BitChannel()).toStrictEqual([[1, 255]]);
    });
  });
});

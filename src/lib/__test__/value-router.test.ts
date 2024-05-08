import { ManualFixtureState } from "../../components/types/fixture.ts";
import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";
import ProfileAdapter from "../adapters/profile-adapter.ts";
import { ActionObject } from "../command-line/types/command-line-types.ts";
import { ProfileTarget } from "../types/buttons.ts";
import ValueRouter from "../value-router.ts";

const profile = { 1: "DIMMER" };
const fixture: ParsedCompositeFixtureInfo = {
  values: [
    [4, 255],
    [5, 255],
  ],
  channelPairs16Bit: [
    [1, 2],
    [4, 5],
  ],
  fixtureAssignmentId: 1,
  channel: 1,
  profileChannels: profile,
  profileName: "test",
  sceneId: 1,
  addressStart: 1,
  addressEnd: 10,
  title: "test",
  fixtureName: "fixture1",
  fixtureNotes: "test notes",
  colorTempHigh: 10000,
  colorTempLow: 2800,
  is16Bit: true,
};

const profileColorTemp = {
  1: "DIMMER",
  2: "DIMMER fine",
  3: "COLOR TEMP",
  4: "COLOR TEMP fine",
};

const fixtureColorTemp: ParsedCompositeFixtureInfo = {
  values: [
    [3, 255],
    [4, 255],
  ],
  channelPairs16Bit: [
    [1, 2],
    [3, 4],
  ],
  fixtureAssignmentId: 1,
  channel: 1,
  profileChannels: profile,
  profileName: "test",
  sceneId: 1,
  addressStart: 1,
  addressEnd: 10,
  title: "test",
  fixtureName: "fixture1",
  fixtureNotes: "test notes",
  colorTempHigh: 10000,
  colorTempLow: 2800,
  is16Bit: true,
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

describe("ValueRouter Tests", () => {
  test("value router initialization", () => {
    const profileAdapter = new ProfileAdapter("DIMMER", profile);
    const actionObject: ActionObject = {
      selection: [1],
      directive: 50,
      profileTarget: ProfileTarget.DIMMER,
      complete: false,
    };
    const valueRouter = new ValueRouter(actionObject, profileAdapter, fixture);
    expect(valueRouter.profileAdapter).toBe(profileAdapter);
    expect(valueRouter.actionObject).toBe(actionObject);
    expect(valueRouter.channels).toEqual([["1", "DIMMER"]]);
  });

  test("build result error handling", () => {
    const profileAdapter = new ProfileAdapter("DIMMER", profile);
    const actionObject: ActionObject = {
      selection: [1],
      directive: 100,
      profileTarget: ProfileTarget.DIMMER,
      complete: false,
    };
    const valueRouter = new ValueRouter(actionObject, profileAdapter, fixture);
    valueRouter.channels = []; // Force an unsupported channel configuration

    expect(() => valueRouter.buildResult()).toThrow("Could not route Values");
  });

  describe("Constructor and Color Temperature Conversion", () => {
    test("constructor initialization and color temp conversion", () => {
      const actionObject: ActionObject = {
        selection: [1],
        directive: 5000,
        profileTarget: ProfileTarget.COLOR_TEMP,
        complete: true,
      };
      const profileAdapter = new ProfileAdapter("COLOR TEMP", profileColorTemp);
      const router = new ValueRouter(actionObject, profileAdapter, fixture);

      expect(router.channels).toEqual([
        ["3", "COLOR TEMP"],
        ["4", "COLOR TEMP fine"],
      ]);
      expect(actionObject.directive).toBe(30.56);
    });
  });

  describe("Mutate or Merge Fixture Channels", () => {
    const actionObject: ActionObject = {
      selection: [1],
      directive: 10000,
      profileTarget: ProfileTarget.COLOR_TEMP,
      complete: true,
    };

    const profileAdapterColorTemp = new ProfileAdapter(
      "COLOR TEMP",
      profileColorTemp,
    );
    let router = new ValueRouter(
      actionObject,
      profileAdapterColorTemp,
      fixtureColorTemp,
    );
    test("setUpManualFixture when not present in manualFixtureStore", () => {
      const manualFixtureStateObj2: ManualFixtureState = {
        2: {
          values: [
            [1, 0],
            [2, 0],
          ],
          fixtureAssignmentId: 1,
          channel: 1,
          manualChannels: [1, 2],
        },
      };
      router = new ValueRouter(
        actionObject,
        profileAdapterColorTemp,
        fixtureColorTemp,
      );
      const routerBuildResult = router.buildResult();
      // eslint-disable-next-line dot-notation
      const manualFixtureObj = routerBuildResult["setUpManualFixture"](
        manualFixtureStateObj2,
      );

      expect(manualFixtureObj).toStrictEqual({
        values: [
          [3, 255],
          [4, 255],
        ],
        channel: 1,
        fixtureAssignmentId: 1,
        manualChannels: [3, 4],
      });
    });

    test("setUpManualFixture when present in manualFixtureStore", () => {
      const manualFixtureStateObj3: ManualFixtureState = {
        1: {
          values: [
            [3, 255],
            [4, 255],
          ],
          fixtureAssignmentId: 1,
          channel: 1,
          manualChannels: [1, 2],
        },
      };

      const routerBuildResult = router.buildResult();

      // eslint-disable-next-line dot-notation
      const manualFixtureObj = routerBuildResult["setUpManualFixture"](
        manualFixtureStateObj3,
      );

      expect(manualFixtureObj).toStrictEqual({
        values: [
          [3, 255],
          [4, 255],
        ],
        channel: 1,
        fixtureAssignmentId: 1,
        manualChannels: [1, 2, 3, 4],
      });
    });

    test("mutateOrMergeOutputValues with merge", () => {
      const actionObject10000: ActionObject = {
        selection: [1],
        directive: 10000,
        profileTarget: ProfileTarget.COLOR_TEMP,
        complete: true,
      };
      router = new ValueRouter(
        actionObject10000,
        profileAdapterColorTemp,
        fixture,
      );

      const routerBuildResult = router.buildResult();

      // eslint-disable-next-line dot-notation
      const manualFixtureObj = routerBuildResult["setUpManualFixture"](
        manualFixtureStateObj,
      );
      // eslint-disable-next-line dot-notation
      router["mutateOrMergeOutputValues"](manualFixtureObj);
      expect(manualFixtureStateObj[1].values).toStrictEqual([
        [1, 0],
        [2, 0],
        [3, 255],
        [4, 255],
      ]);
    });

    test("if color temp is below fixture min color temp, jump to fixture min temp", () => {
      const actionObject2000: ActionObject = {
        selection: [1],
        directive: 2000,
        profileTarget: ProfileTarget.COLOR_TEMP,
        complete: true,
      };
      const profileAdapter = new ProfileAdapter("COLOR TEMP", profileColorTemp);
      router = new ValueRouter(actionObject2000, profileAdapter, fixture);
      const routerBuildResult = router.buildResult();

      // eslint-disable-next-line dot-notation
      const manualFixtureObj = routerBuildResult["setUpManualFixture"](
        manualFixtureStateObj,
      );
      // eslint-disable-next-line dot-notation
      router["mutateOrMergeOutputValues"](manualFixtureObj);
      expect(manualFixtureStateObj[1].values).toStrictEqual([
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
      ]);
    });

    test("if color temp is above fixture max color temp, jump to fixture max temp", () => {
      const actionObject19000: ActionObject = {
        selection: [1],
        directive: 19000,
        profileTarget: ProfileTarget.COLOR_TEMP,
        complete: true,
      };
      const profileAdapter = new ProfileAdapter("COLOR TEMP", profileColorTemp);
      router = new ValueRouter(actionObject19000, profileAdapter, fixture);

      const routerBuildResult = router.buildResult();

      // eslint-disable-next-line dot-notation
      const manualFixtureObj = routerBuildResult["setUpManualFixture"](
        manualFixtureStateObj,
      );
      // eslint-disable-next-line dot-notation
      router["mutateOrMergeOutputValues"](manualFixtureObj);
      expect(manualFixtureStateObj[1].values).toStrictEqual([
        [1, 0],
        [2, 0],
        [3, 255],
        [4, 255],
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
    const actionObjectDimmer: ActionObject = {
      selection: [1],
      directive: 100,
      profileTarget: ProfileTarget.DIMMER,
      complete: true,
    };
    const actionObjectColorTemp: ActionObject = {
      selection: [1],
      directive: 10000,
      profileTarget: ProfileTarget.COLOR_TEMP,
      complete: true,
    };

    test("Parses 16-bit channels", () => {
      const profileAdapterDimmer = new ProfileAdapter("DIMMER", profile16bit);
      let router = new ValueRouter(
        actionObjectDimmer,
        profileAdapterDimmer,
        fixture,
      );
      expect(router.channelIs16Bit()).toBe(true);
      expect(router.channelIs8Bit()).toBe(false);
      router.buildResult();
      expect(router.parse16BitChannels()).toStrictEqual([
        [1, 255],
        [2, 255],
      ]);

      const profileAdapterColorTemp = new ProfileAdapter(
        "COLOR TEMP",
        profile16bit,
      );
      router = new ValueRouter(
        actionObjectColorTemp,
        profileAdapterColorTemp,
        fixture,
      );
      expect(router.channelIs16Bit()).toBe(true);
      expect(router.channelIs8Bit()).toBe(false);
      router.buildResult();
      expect(router.parse16BitChannels()).toStrictEqual([
        [3, 255],
        [4, 255],
      ]);
    });

    test("Parses 8-bit channels", () => {
      const profileAdapter = new ProfileAdapter("DIMMER", profile8bit);
      const router = new ValueRouter(
        actionObjectDimmer,
        profileAdapter,
        fixture,
      );
      expect(router.channelIs16Bit()).toBe(false);
      expect(router.channelIs8Bit()).toBe(true);
      router.buildResult();

      expect(router.parse8BitChannel()).toStrictEqual([[1, 255]]);
    });
  });
});

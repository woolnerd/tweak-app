import { ManualFixtureState } from "../../app/components/Fixture/types/Fixture.ts";
import ProfileAdapter from "../adapters/profile-adapter.ts";
import { ActionObject } from "../command-line/types/command-line-types.ts";
import { ProfileTarget } from "../types/buttons.ts";
import * as utils from "../value-router-utils.ts";
import ValueRouter from "../value-router.ts";

const {
  profileColorTemp,
  manualFixtureStateObj,
  makeActionObj,
  profile8bit,
  profile16bit,
  actionObjectDimmer,
} = utils;

describe("ValueRouter Tests", () => {
  const { profile, fixture, fixtureColorTemp } = utils;
  test("value router initialization", () => {
    const profileAdapter = new ProfileAdapter("DIMMER", profile);
    const actionObjectDimmer50: ActionObject = {
      selection: [1],
      directive: 50,
      profileTarget: ProfileTarget.DIMMER,
      complete: false,
    };
    const valueRouter = new ValueRouter(
      actionObjectDimmer50,
      profileAdapter,
      fixture,
    );
    expect(valueRouter.profileAdapter).toBe(profileAdapter);
    expect(valueRouter.actionObject).toStrictEqual(actionObjectDimmer50);
    expect(valueRouter.channels).toEqual([["1", "DIMMER"]]);
  });

  test("build result error handling", () => {
    const profileAdapter = new ProfileAdapter("DIMMER", profile);
    const actionObjectDimmer100: ActionObject = {
      selection: [1],
      directive: 100,
      profileTarget: ProfileTarget.DIMMER,
      complete: false,
    };
    const valueRouter = new ValueRouter(
      actionObjectDimmer100,
      profileAdapter,
      fixture,
    );
    valueRouter.channels = []; // Force an unsupported channel configuration

    expect(() => valueRouter.buildResult()).toThrow("Could not route Values");
  });

  describe("Constructor and Color Temperature Conversion", () => {
    const actionObjectColor5000 = makeActionObj(5000);
    test("constructor initialization and color temp conversion, without mutating actionObject", () => {
      const profileAdapter = new ProfileAdapter("COLOR TEMP", profileColorTemp);
      const router = new ValueRouter(
        actionObjectColor5000,
        profileAdapter,
        fixture,
      );

      expect(router.channels).toEqual([
        ["3", "COLOR TEMP"],
        ["4", "COLOR TEMP fine"],
      ]);
      expect(router.actionObject.directive).toBe(30.56);
      expect(actionObjectColor5000.directive).toBe(5000);
    });
  });

  describe("Mutate or Merge Fixture Channels", () => {
    const actionObjectColor10000 = makeActionObj(10000);

    const profileAdapterColorTemp = new ProfileAdapter(
      "COLOR TEMP",
      profileColorTemp,
    );
    let router = new ValueRouter(
      actionObjectColor10000,
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
        actionObjectColor10000,
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
      router = new ValueRouter(
        actionObjectColor10000,
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
      const profileAdapter = new ProfileAdapter("COLOR TEMP", profileColorTemp);
      router = new ValueRouter(makeActionObj(2000), profileAdapter, fixture);
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
      const profileAdapter = new ProfileAdapter("COLOR TEMP", profileColorTemp);
      router = new ValueRouter(makeActionObj(19000), profileAdapter, fixture);

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
    const actionObjectColorTemp = makeActionObj(10000);
    test("Parses 16-bit channels", () => {
      const profileAdapterDimmer = new ProfileAdapter("DIMMER", profile16bit);
      let router = new ValueRouter(
        actionObjectDimmer,
        profileAdapterDimmer,
        fixture,
      );
      expect(router.channelIs16Btest()).toBe(true);
      expect(router.channelIs8Btest()).toBe(false);
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
      expect(router.channelIs16Btest()).toBe(true);
      expect(router.channelIs8Btest()).toBe(false);
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
      expect(router.channelIs16Btest()).toBe(false);
      expect(router.channelIs8Btest()).toBe(true);
      router.buildResult();

      expect(router.parse8BitChannel()).toStrictEqual([[1, 255]]);
    });
  });
});

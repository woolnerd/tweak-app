import ChannelValueCalculator from "../../util/channel-value-calculator.ts";
import ProfileAdapter from "../adapters/profile-adapter.ts";
import { ActionObject } from "../command-line/types/command-line-types.ts";
import { ProfileTarget } from "../types/buttons.ts";
import ValueRouter from "../value-router.ts";

describe("ValueRouter Tests", () => {
  test("test_value_router_initialization", () => {
    const profile = { 1: "DIMMER" };
    const profileAdapter = new ProfileAdapter("DIMMER", profile);
    const actionObject: ActionObject = {
      selection: [1],
      directive: 5000,
      profileTarget: ProfileTarget.COLOR_TEMP,
      complete: false,
    };
    const valueRouter = new ValueRouter(actionObject, profileAdapter);

    expect(valueRouter.profileAdapter).toBe(profileAdapter);
    expect(valueRouter.actionObject).toBe(actionObject);
    expect(valueRouter.channels).toEqual([["1", "DIMMER"]]);
    expect(valueRouter.values).toEqual([19, 136]);
  });

  test("test_build_result_error_handling", () => {
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

  test("test_convert_color_temp_to_percentage", () => {
    const profile = { 1: "COLOR TEMP" };
    const profileAdapter = new ProfileAdapter("COLOR TEMP", profile);
    const actionObject: ActionObject = {
      selection: [1],
      directive: 5000,
      profileTarget: ProfileTarget.COLOR_TEMP,
      complete: false,
    };
    const valueRouter = new ValueRouter(actionObject, profileAdapter);
    valueRouter.convertColorTempToPercentage();

    expect(actionObject.directive).toBeCloseTo(275.0, 2);
  });
});

import ProfileAdapter from "../../adapters/profile-adapter.ts";
// import HistoryStack from "../../history-stack.ts";
import { Buttons, ControlButton, ProfileTarget } from "../../types/buttons.ts";
import CommandLineService from "../command-line-service.ts";

describe("CommandLineService", () => {
  let commandLineService: CommandLineService;

  beforeEach(() => {
    const commmandLineEvents: ControlButton[] = [
      {
        type: Buttons.KEYPAD_BUTTON,
        id: "",
        label: "1",
        styles: { background: "red" },
      },
      {
        type: Buttons.KEYPAD_BUTTON,
        id: "",
        label: "@",
        styles: { background: "red" },
      },
      {
        type: Buttons.DIRECT_ACTION_BUTTON,
        value: 50,
        profileTarget: ProfileTarget.DIMMER,
        id: "",
        label: "50%",
        styles: { background: "red" },
      },
    ];
    commandLineService = new CommandLineService(commmandLineEvents);
    commandLineService.profileAdapter = new ProfileAdapter("DIMMER", {
      1: "Dimmer",
      2: "Dimmer fine",
    });
    // commandLineService.history = new HistoryStack();
    // commandLineService.commandEvents = [];
    commandLineService.errors = [];
  });

  test("buildAction assigns ActionObject", () => {
    // commandLineService.buildAction();
    // expect(commandLineService.action).toBeDefined();
  });
});

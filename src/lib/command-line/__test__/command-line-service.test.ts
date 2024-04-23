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
        styles: { color: "red" },
      },
      {
        type: Buttons.KEYPAD_BUTTON,
        id: "",
        label: "@",
        styles: { color: "red" },
      },
      {
        type: Buttons.DIRECT_ACTION_BUTTON,
        value: 50,
        profileTarget: ProfileTarget.DIMMER,
        id: "",
        label: "50%",
        styles: { color: "red" },
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

  test("test_buildAction_assigns_ActionObject", () => {
    commandLineService.buildAction();
    expect(commandLineService.action).toBeDefined();
  });

  test("test_checkUndoEvent_identifies_undo", () => {
    // commandLineService.commandEvents = comandLineEvents;
    const hasUndo = commandLineService.checkUndoEvent();
    expect(hasUndo).toBe(true);
  });

  // test("test_addToHistory_adds_commandEvents_to_history", () => {
  //   const spyAdd = jest.spyOn(commandLineService.history, "add");
  //   commandLineService.commandEvents = ["event1", "event2"];
  //   commandLineService.addToHistory();
  //   expect(spyAdd).toHaveBeenCalledWith(["event1", "event2"]);
  // });
});

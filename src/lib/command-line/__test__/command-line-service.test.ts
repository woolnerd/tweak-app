import ProfileAdapter from "../../adapters/profile-adapter.ts";
import HistoryStack from "../../history-stack.ts";
import CommandLineService from "../command-line-service.ts";

describe("CommandLineService", () => {
  let commandLineService: CommandLineService;

  beforeEach(() => {
    commandLineService = new CommandLineService();
    commandLineService.profileAdapter = new ProfileAdapter();
    commandLineService.history = new HistoryStack();
    commandLineService.commandEvents = [];
    commandLineService.errors = [];
  });

  test("test_buildAction_assigns_ActionObject", () => {
    commandLineService.buildAction();
    expect(commandLineService.action).toBeDefined();
  });

  test("test_checkUndoEvent_identifies_undo", () => {
    commandLineService.commandEvents = ["someEvent", "undo", "anotherEvent"];
    const hasUndo = commandLineService.checkUndoEvent();
    expect(hasUndo).toBe(true);
  });

  test("test_addToHistory_adds_commandEvents_to_history", () => {
    const spyAdd = jest.spyOn(commandLineService.history, "add");
    commandLineService.commandEvents = ["event1", "event2"];
    commandLineService.addToHistory();
    expect(spyAdd).toHaveBeenCalledWith(["event1", "event2"]);
  });
});

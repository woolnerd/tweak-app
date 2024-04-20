/* eslint-disable dot-notation */
import CommandLineService from "../command-line-service.ts";
import CommandLine from "../command-line.ts";

describe("CommandLine", () => {
  let commandLine: CommandLine;
  let mockService: Partial<CommandLineService>;

  beforeEach(() => {
    mockService = {
      action: { action: "test-action" },
    };
    commandLine = new CommandLine();
    commandLine["service"] = mockService as CommandLineService;
    commandLine["errors"] = ["Error 1", "Error 2"];
  });

  test("test_displayErrors_returns_errors", () => {
    expect(commandLine.displayErrors()).toEqual(["Error 1", "Error 2"]);
  });

  test("test_sendAction_returns_action", () => {
    expect(commandLine.sendAction()).toEqual({ action: "test-action" });
  });

  test("test_sendAction_returns_empty_if_no_action", () => {
    mockService.action = {};
    expect(commandLine.sendAction()).toEqual({});
  });
});

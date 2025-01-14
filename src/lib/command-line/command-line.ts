import CommandLineErrorHandler from "./command-line-error-handler.ts";
import CommandLineService from "./command-line-service.ts";
import CommandLineStack from "./command-line-stack.ts";
import { ActionObject } from "./types/command-line-types.ts";
import {
  Buttons,
  COMMAND,
  ControlButton,
  ProfileTarget,
} from "../types/buttons.ts";

export default class CommandLine {
  // eslint-disable-next-line no-use-before-define
  static instance: null | CommandLine = null;

  public commandEvents: CommandLineStack;

  private errors: CommandLineErrorHandler;

  private service: CommandLineService;

  fixtureSelection: number[];

  constructor() {
    if (CommandLine.instance !== null) {
      throw new Error("Cannot instantiate more than one Singleton instance");
    }
    this.commandEvents = new CommandLineStack();
    this.errors = new CommandLineErrorHandler();
  }

  static getInstance(fixtureSelection: number[] = []) {
    if (CommandLine.instance === null) {
      CommandLine.instance = new CommandLine();
    }
    CommandLine.instance.fixtureSelection = fixtureSelection;
    return CommandLine.instance;
  }

  displayErrors(): string[] {
    return this.errors.errors;
  }

  sendAction(): ActionObject {
    return this.service.action;
  }

  process(data: ControlButton) {
    console.log(data.label);

    const emptyAction: ActionObject = {
      directive: 0,
      selection: this.fixtureSelection,
      profileTarget: ProfileTarget.EMPTY,
      complete: false,
    };

    this.commandEvents.add(data);
    console.log(this.commandEvents.commands);

    if (data.type === Buttons.DIRECT_ACTION_BUTTON) {
      return this.actionProc();
    }

    if (CommandLine.atSignPressed(data)) {
      console.log("not implemented");

      this.service = new CommandLineService(this.commandEvents.commands);
      return this.service.buildSelectionFeedback();
    }

    if (this.clearPressed(data)) {
      console.log("Cleared");
      this.clearCommands();
      return {
        complete: false,
        directive: COMMAND.CLEAR,
        profileTarget: ProfileTarget.EMPTY,
        selection: [],
      };
    }

    if (CommandLine.enterPressed(data)) {
      this.commandEvents.clearLast();

      if (this.commandLineEmpty()) {
        console.log("Command Line is Empty");
        return emptyAction;
      }

      this.actionProc();
    }
    return emptyAction;
  }

  actionProc() {
    this.service = new CommandLineService(
      this.commandEvents.commands,
      this.fixtureSelection,
    );
    this.service.process();
    const action = this.sendAction();
    this.clearCommands();
    this.commandEvents = new CommandLineStack();
    return action;
  }

  static enterPressed(data: ControlButton) {
    return data.label.toLowerCase() === "confirm";
  }

  clearPressed(data: ControlButton) {
    this.fixtureSelection = [];
    return data.label.toLowerCase() === "clear";
  }

  static atSignPressed(data: ControlButton) {
    return data.label.toLowerCase() === "@";
  }

  commandLineEmpty() {
    return this.commandEvents.isEmpty();
  }

  clearCommands() {
    this.commandEvents = new CommandLineStack();
  }
}

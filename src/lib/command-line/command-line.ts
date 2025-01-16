import CommandLineErrorHandler from "./command-line-error-handler.ts";
import CommandLineService from "./command-line-service.ts";
import CommandLineStack from "./command-line-stack.ts";
import { ActionObject } from "./types/command-line-types.ts";
import {
  Buttons,
  COMMAND_NUMERIC,
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

  private waitingForValueLevels = false;

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

  // not implemented
  displayErrors(): string[] {
    return this.errors.errors;
  }

  sendAction(): ActionObject {
    return this.service.action;
  }

  process(data: ControlButton) {
    console.log(data.label);

    // push latest button data onto command stack
    this.commandEvents.add(data);

    // bypass further setup if button is type direct action
    if (data.type === Buttons.DIRECT_ACTION_BUTTON) {
      return this.actionProc();
    }

    // clears out selection
    if (this.clearPressed(data)) {
      console.log("Cleared");
      this.clearCommands();
      return {
        complete: false,
        directive: COMMAND_NUMERIC.CLEAR,
        profileTarget: ProfileTarget.EMPTY,
        selection: [],
      };
    }

    // once the "@" sign is pressed we want to await a value string like "55" or "3200"
    if (CommandLine.atSignPressed(data)) {
      this.waitingForValueLevels = true;
    }

    console.log(this.waitingForValueLevels, "waiting");
    console.log(this.hasFixtureSelection(), "has selection");

    if (this.waitingForValueLevels && CommandLine.enterPressed(data)) {
      console.log("all two mets");

      // this.actionProc();
      this.service = new CommandLineService(
        this.commandEvents.commands,
        // this.fixtureSelection,
      );
      this.service.process();
      const action = this.sendAction();
      // this.clearCommands();
      // this.commandEvents = new CommandLineStack();
      return action;
    }

    if (this.waitingForValueLevels || CommandLine.enterPressed(data)) {
      // instantiate CommandLineService with latest command stack
      this.service = new CommandLineService(this.commandEvents.commands);
      return this.service.buildSelectionFeedback();
    }

    // if (CommandLine.enterPressed(data)) {
    //   this.commandEvents.clearLast();

    //   if (this.commandLineEmpty()) {
    //     console.log("Command Line is Empty");
    //     return emptyAction;
    //   }

    //   this.actionProc();
    // }

    return this.emptyAction();
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
    return data.label.toLowerCase() === COMMAND.CONFIRM;
  }

  clearPressed(data: ControlButton) {
    this.fixtureSelection = [];
    return data.label.toLowerCase() === COMMAND.CLEAR;
  }

  static atSignPressed(data: ControlButton) {
    return data.label.toLowerCase() === COMMAND.AT_SIGN;
  }

  commandLineEmpty() {
    return this.commandEvents.isEmpty();
  }

  clearCommands() {
    this.commandEvents = new CommandLineStack();
    this.waitingForValueLevels = false;
  }

  allButtonsAreKeypad() {
    return this.commandEvents.commands.every(
      (command) => command.type !== Buttons.DIRECT_ACTION_BUTTON,
    );
  }

  hasFixtureSelection() {
    return this.fixtureSelection.length > 0;
  }

  emptyAction(): ActionObject {
    return {
      directive: COMMAND_NUMERIC.EMPTY,
      selection: this.fixtureSelection,
      profileTarget: ProfileTarget.EMPTY,
      complete: false,
    };
  }
}

import CommandLineErrorHandler from "./command-line-error-handler.ts";
import CommandLineService from "./command-line-service.ts";
import CommandLineStack from "./command-line-stack.ts";
import { ActionObject } from "./types/command-line-types.ts";
import { Buttons, ControlButton, ProfileTarget } from "../types/buttons.ts";

export default class CommandLine {
  // eslint-disable-next-line no-use-before-define
  static instance: null | CommandLine = null;

  public commandEvents: CommandLineStack;

  private errors: CommandLineErrorHandler;

  private service: CommandLineService;

  constructor() {
    if (CommandLine.instance !== null) {
      throw new Error("Cannot instantiate more than one Singleton instance");
    }
    this.commandEvents = new CommandLineStack();
    this.errors = new CommandLineErrorHandler();
  }

  static getInstance() {
    if (CommandLine.instance === null) {
      CommandLine.instance = new CommandLine();
    }
    return CommandLine.instance;
  }

  displayErrors(): string[] {
    return this.errors.errors;
  }

  sendAction(): ActionObject {
    return this.service.action;
  }

  process(data: ControlButton) {
    const emptyAction: ActionObject = {
      directive: 0,
      selection: [],
      profileTarget: ProfileTarget.EMPTY,
      complete: false,
    };

    this.commandEvents.add(data);

    if (data.type === Buttons.DIRECT_ACTION_BUTTON) {
      return this.onDirectAction();
    }

    if (this.onClearPress()) {
      this.clearCommands();
      console.log("Cleared");
    }

    if (this.onEnterPress()) {
      this.commandEvents.clearLast();
      this.onDirectAction();
    }
    return emptyAction;
  }

  onDirectAction() {
    this.service = new CommandLineService(this.commandEvents.commands);
    this.service.process();
    const action = this.sendAction();
    this.clearCommands();
    this.commandEvents = new CommandLineStack();
    return action;
  }

  onEnterPress() {
    return this.commandEvents.peak.label.toLowerCase() === "enter";
  }

  onClearPress() {
    return this.commandEvents.peak.label.toLowerCase() === "clear";
  }

  clearCommands() {
    this.commandEvents = new CommandLineStack();
  }

  selectionFromLayout() {
    // if we have a fixtures selected in our layout, then we come here.
    // we could push the fixture objects onto the stack
  }
}

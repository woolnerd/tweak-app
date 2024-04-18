import CommandLineErrorHandler from "./command-line-error-handler.ts";
import CommandLineService from "./command-line-service.ts";
import CommandLineStack from "./command-line-stack.ts";
import { ActionObject } from "./types/command-line-types.ts";
import { ControlButton } from "../types/buttons.ts";

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
    // this could be an array of callbacks and objects to receive as args??
    // basically procedures for the hook to call on the database
    return this.service.action;
  }

  process(data: ControlButton) {
    this.commandEvents.add(data);

    if (this.onClearPress()) {
      this.clearCommands();
      console.log("Cleared");
      return { directive: "", selection: [], profileTarget: "" };
    }

    if (this.onEnterPress()) {
      this.commandEvents.clearLast();
      this.service = new CommandLineService(this.commandEvents.commands);
      this.service.process();
      const action = this.sendAction();
      this.clearCommands();
      this.commandEvents = new CommandLineStack();

      return action;
    }
    return { directive: 0, selection: [], profileTarget: "", complete: false };
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
}

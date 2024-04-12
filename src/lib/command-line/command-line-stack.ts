import CommandLineErrorHandler from "./command-line-error-handler.ts";
import StackBase from "../../util/stack-base.ts";
import { ControlButton } from "../types/buttons.ts";

export default class CommandLineStack extends StackBase<ControlButton> {
  // eslint-disable-next-line no-use-before-define
  static instance: null | CommandLineStack = null;

  commands: ControlButton[];

  errorHandler = new CommandLineErrorHandler();

  constructor() {
    if (CommandLineStack.instance !== null) {
      throw new Error("Cannot instantiate more than one Singleton instance");
    }
    super();
    this.commands = this.stack;
  }

  static getInstance() {
    if (CommandLineStack.instance === null) {
      CommandLineStack.instance = new CommandLineStack();
    }
    return CommandLineStack.instance;
  }

  clearAll() {
    this.commands = [];
  }

  clearLast() {
    this.remove();
  }

  checkButtonType() {
    this.commands.filter((command) =>
      this.errorHandler.ensureValid(command.label),
    );
    // use errorHandler to check types.
  }
}

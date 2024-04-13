import CommandLineErrorHandler from "./command-line-error-handler.ts";
import StackBase from "../../util/stack-base.ts";
import { ControlButton } from "../types/buttons.ts";

export default class CommandLineStack extends StackBase<ControlButton> {
  commands: ControlButton[];

  errorHandler = new CommandLineErrorHandler();

  constructor() {
    super();
    this.commands = this.stack;
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

  peakKeyIdentifier() {
    return this.commands[0].label;
  }
}

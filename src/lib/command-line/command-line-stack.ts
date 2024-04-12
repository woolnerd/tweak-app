import CommandLineErrorHandler from "./command-line-error-handler.ts";
import StackBase from "../../util/stack-base.ts";

export default class CommandLineStack extends StackBase<string> {
  commands: string[] = [];

  errorHandler = new CommandLineErrorHandler();

  clearAll() {
    this.commands = [];
  }

  clearLast() {
    this.remove();
  }

  checkButtonType() {
    this.commands.filter((command) => this.errorHandler.ensureValid(command));
    // use errorHandler to check types.
  }
}

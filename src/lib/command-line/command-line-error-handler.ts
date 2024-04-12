/* eslint-disable class-methods-use-this */
export default class CommandLineErrorHandler {
  commands: string[]; // this probably requires types as well;

  errors: string[];

  ensureValid(str: string) {
    // checks the commands for proper syntax;
    // allowNextCommand?
  }

  checkSyntax(str: string) {}

  allowNextCommand() {
    // checks type of command if it is is allowed against previous command;
  }
}

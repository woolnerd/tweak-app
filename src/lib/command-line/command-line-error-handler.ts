import { CommandButton } from "../types/buttons.ts";

/* eslint-disable class-methods-use-this */
export default class CommandLineErrorHandler {
  commands: CommandButton[]; // this probably requires types as well;

  errors: string[];

  ensureValid(str: CommandButton["label"]) {
    // checks the commands for proper syntax;
    // allowNextCommand?
  }

  checkSyntax(str: string) {}

  allowNextCommand() {
    // checks type of command if it is is allowed against previous command;
  }
}

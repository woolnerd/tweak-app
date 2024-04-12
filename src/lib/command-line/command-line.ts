import CommandLineService from "./command-line-service.ts";
import { ActionObject } from "./types/command-line-types.ts";

export default class CommandLine {
  protected commandEvents: string[];

  protected errors: string[];

  private service: CommandLineService;

  displayErrors(): string[] {
    return this.errors;
  }

  sendAction(): ActionObject {
    // this could be an array of callbacks and objects to receive as args??
    // basically procedures for the hook to call on the database
    return this.service.action;
  }
}

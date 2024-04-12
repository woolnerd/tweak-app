import { range, isNumber } from "lodash";

import { ActionObject } from "./types/command-line-types.ts";
import ProfileAdapter from "../adapters/profile-adapter.ts";
import HistoryStack from "../history-stack.ts";
import { ControlButton } from "../types/buttons.ts";

export default class CommandLineService {
  commandEvents: ControlButton[];

  errors: string[];

  action: ActionObject;

  profileAdapter: ProfileAdapter;

  history: HistoryStack;

  public set setEvents(events: ControlButton[]) {
    this.commandEvents = events;
  }

  process(commandEvents: ControlButton[]) {
    this.setEvents = commandEvents;
    //  examples:
    // ["3","thru","5","@","50%"],
    // ["Group", "2", "@", "10%"] A FixtureGroups should be a table of fixture ids;
    // ["1", "thru", "10", "+", "20", "@", "3200"]
    // query db for fixtureAssignments in array [1..10, 20]
  }

  buildAction(): void {
    const action: ActionObject = {};
    // do stuff;
    this.action = action;
  }

  checkUndoEvent(): boolean {
    return (
      this.commandEvents.filter((event) =>
        event.label.toLowerCase().match("undo"),
      ).length > 0
    );
  }

  adaptProfile(): void {
    this.profileAdapter.parse(this.commandEvents);
  }

  addToHistory(): void {
    this.history.add(this.commandEvents);
  }

  private getLabels() {
    return this.commandEvents.map((event) => event.label);
  }

  private buildFixtureArray() {
    // ["Chan", "1", "thru", "10", "+", "20", "@", "3200"];
  }

  getRange() {
    const labelArray = this.getLabels();
    const index = labelArray.indexOf("thru");
    return range(
      parseInt(labelArray[index - 1], 10),
      parseInt(labelArray[index + 1], 10),
    );
  }
}

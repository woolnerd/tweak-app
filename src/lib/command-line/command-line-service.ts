import { range } from "lodash";

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

  selection: number[];

  valueDirective: number;

  constructor(commandEvents: ControlButton[]) {
    this.commandEvents = commandEvents;
    this.buildSelectionArray();
    this.getValueDirective();
  }

  process() {
    this.buildAction();
    //  examples:
    // ["3","thru","5","@","50%"],
    // ["Group", "2", "@", "10%"] A FixtureGroups should be a table of fixture ids;
    // ["1", "thru", "10", "+", "20", "@", "3200"]
    // query db for fixtureAssignments in array [1..10, 20]
  }

  buildAction(): void {
    this.action = { selection: this.selection, directive: this.valueDirective };
  }

  checkUndoEvent(): boolean {
    return (
      this.commandEvents.filter((event) =>
        event.label.toLowerCase().match("undo"),
      ).length > 0
    );
  }

  // adaptProfile(): void {
  // this.profileAdapter.parse();
  // }

  addToHistory(): void {
    this.history.add(this.commandEvents);
  }

  private getLabels() {
    return this.commandEvents.map((event) => event.label.toLowerCase());
  }

  private buildSelectionArray() {
    // ["Chan", "1", "thru", "10", "+", "20", "@", "3200"];
    this.selection = this.getRangeAndAddAdditionals();
  }

  getRange() {
    const labelArray = this.getLabels();
    const index = labelArray.indexOf("thru");
    return range(
      parseInt(labelArray[index - 1], 10),
      parseInt(labelArray[index + 1], 10) + 1,
    );
  }

  getValueDirective() {
    const labelArray = this.getLabels();
    const index = labelArray.indexOf("@");
    this.valueDirective = parseInt(labelArray[index + 1], 10);
  }

  getRangeAndAddAdditionals() {
    const buildingRange = this.getRange();
    const labelArray = this.getLabels();
    labelArray.forEach((label, idx) => {
      // if we find a + the next value must be a new value.
      if (label === "+") {
        buildingRange.push(parseInt(labelArray[idx + 1], 10));
      }
    });

    return buildingRange;
  }
}

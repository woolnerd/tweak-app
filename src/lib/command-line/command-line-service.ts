import { range } from "lodash";

import { ActionObject } from "./types/command-line-types.ts";
import ProfileAdapter from "../adapters/profile-adapter.ts";
import HistoryStack from "../history-stack.ts";
import {
  Buttons,
  ControlButton,
  DirectActionButton,
  KeyPadButton,
  ProfileTarget,
} from "../types/buttons.ts";

export default class CommandLineService {
  commandEvents: ControlButton[];

  errors: string[];

  action: ActionObject;

  profileAdapter: ProfileAdapter;

  history: HistoryStack;

  selection: number[];

  valueDirective: number;

  profileTarget: ProfileTarget;

  constructor(commandEvents: ControlButton[]) {
    this.commandEvents = commandEvents;
    this.buildSelectionArray();
    this.getValueDirective();
    this.getProfileTarget();
  }

  // static shouldBuildKeyPadVals(prevVal: ControlButton, curVal: ControlButton) {
  //   return (
  //     prevVal.type === Buttons.KEYPAD_BUTTON &&
  //     curVal.type === Buttons.KEYPAD_BUTTON
  //   );
  // }

  // static buildKeyPadVals(prevData: KeyPadButton, curData: KeyPadButton) {
  //   return prevData.label.
  // }

  process() {
    this.buildAction();
    //  examples:
    // ["3","thru","5","@","50%"],
    // ["Group", "2", "@", "10%"] A FixtureGroups should be a table of fixture ids;
    // ["1", "thru", "10", "+", "20", "@", "3200"]
    // query db for fixtureAssignments in array [1..10, 20]
  }

  buildAction(): void {
    this.action = {
      selection: this.selection,
      directive: this.valueDirective,
      profileTarget: this.profileTarget,
    };
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

  private buildCommandArray() {
    return this.concatKeyPadEntries().map((event) => event.label.toLowerCase());
  }

  private buildSelectionArray() {
    // ["Chan", "1", "thru", "10", "+", "20", "@", "3200"];
    this.selection = this.getRangeAndAddAdditionals();
  }

  getRange() {
    const labelArray = this.buildCommandArray();
    const index = labelArray.indexOf("thru");
    return range(
      parseInt(labelArray[index - 1], 10),
      parseInt(labelArray[index + 1], 10) + 1,
    );
  }

  getValueDirective() {
    const directive = this.getDirectiveButtonEvent();
    this.valueDirective = parseInt(directive.label, 10);
  }

  getProfileTarget() {
    const directive = this.getDirectiveButtonEvent();
    this.profileTarget = directive.profileTarget;
  }

  getDirectiveButtonEvent() {
    const directive = this.commandEvents.find(
      (event) => event.type === Buttons.DIRECT_ACTION_BUTTON,
    );
    if (!directive) {
      throw new Error("Directive not found");
    }

    return directive as DirectActionButton;
  }

  getRangeAndAddAdditionals() {
    const buildingRange = this.getRange();
    const labelArray = this.buildCommandArray();
    labelArray.forEach((label, idx) => {
      // if we find a + the next value must be a new value.
      if (label === "+") {
        buildingRange.push(parseInt(labelArray[idx + 1], 10));
      }
    });

    return buildingRange;
  }

  concatKeyPadEntries() {
    let dummyBtn: KeyPadButton = {
      id: "dummyButton",
      type: Buttons.KEYPAD_BUTTON,
      label: "",
      styles: { color: "" },
    };
    // ["Chan", "1", "thru", "1", "0", "0", "+", "2", "0", "@", "3200"];
    const result: ControlButton[] = [];
    this.commandEvents.forEach((buttonEvent) => {
      if (buttonEvent.type === Buttons.KEYPAD_BUTTON) {
        dummyBtn.label += buttonEvent.label;
      } else if (dummyBtn.label.length > 0) {
        result.push(dummyBtn);
        dummyBtn = {
          id: "dummyButton",
          type: Buttons.KEYPAD_BUTTON,
          label: "",
          styles: { color: "" },
        };
      } else {
        result.push(buttonEvent);
      }
    });
    console.log(result);

    return result;
  }
}

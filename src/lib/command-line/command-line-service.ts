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

  constructor(commandEvents: ControlButton[], fixtureSelection: number[] = []) {
    this.commandEvents = commandEvents;
    if (fixtureSelection.length > 1) {
      // alwayas have that -1 in there, ugh
      this.selection = fixtureSelection;
    } else {
      this.buildSelectionArray();
    }
    this.getValueDirective();
    this.getProfileTarget();
  }

  process() {
    this.buildAction();
  }

  buildAction(): void {
    this.action = {
      selection: this.selection,
      directive: this.valueDirective,
      profileTarget: this.profileTarget,
      complete: true,
    };
  }

  buildSelectionFeedback(): ActionObject {
    return {
      selection: this.selection,
      directive: 0,
      profileTarget: ProfileTarget.EMPTY,
      complete: true,
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
    const index = labelArray.indexOf("thru"); // handles one 'thru' for now

    if (index === -1) {
      return -1;
    }
    return range(
      parseInt(labelArray[index - 1], 10),
      parseInt(labelArray[index + 1], 10) + 1,
    );
  }

  getValueDirective() {
    const directive = this.getDirectiveButtonEvent();
    this.valueDirective = directive.value;
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
    if (this.oneChannelSelection()) {
      return [parseInt(this.buildCommandArray()[0], 10)];
    }

    const capturedRange = this.getRange();
    const buildingRange = capturedRange === -1 ? [] : capturedRange;

    const labelArray = this.buildCommandArray();

    labelArray.forEach((label, idx) => {
      // if we find a + the next value must be a new value.
      if (label === "+") {
        if (idx === 1) {
          buildingRange.push(parseInt(labelArray[idx - 1], 10));
        }

        buildingRange.push(parseInt(labelArray[idx + 1], 10));
      }
    });
    return buildingRange;
  }

  concatKeyPadEntries() {
    let btnIdx = 1;
    let dummyBtn: KeyPadButton = CommandLineService.makeDummyButton(btnIdx);

    const result: ControlButton[] = [];

    this.commandEvents.forEach((buttonEvent) => {
      if (
        buttonEvent.type !== Buttons.KEYPAD_BUTTON &&
        dummyBtn.label.length > 0
      ) {
        result.push(dummyBtn);
        dummyBtn = CommandLineService.makeDummyButton((btnIdx += 1));
      }

      if (buttonEvent.type === Buttons.KEYPAD_BUTTON) {
        dummyBtn.label += buttonEvent.label;
      } else {
        result.push(buttonEvent);
      }
    });

    return result;
  }

  static makeDummyButton(idx: number): KeyPadButton {
    return {
      id: `MergedKeyPadButton${idx}`,
      type: Buttons.KEYPAD_BUTTON,
      label: "",
      styles: { color: "" },
    };
  }

  oneChannelSelection() {
    return (
      this.concatKeyPadEntries().filter(
        (entry) => entry.type === Buttons.KEYPAD_BUTTON,
      ).length === 1
    );
  }
}

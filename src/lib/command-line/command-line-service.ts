import { range } from "lodash";

import { ActionObject } from "./types/command-line-types.ts";
import ProfileAdapter from "../adapters/profile-adapter.ts";
import HistoryStack from "../history-stack.ts";
import {
  Buttons,
  COMMAND,
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
    this.getProfileTarget();
    this.getValueDirective();
  }

  process() {
    this.buildAction();
  }

  buildAction(): void {
    if (!this.valueDirective) {
      this.getValueDirective();
    }

    this.action = {
      selection: this.selection,
      directive: this.valueDirective,
      profileTarget: this.profileTarget,
      complete: true,
    };
  }

  // does not change output levels, only effects fixture selection
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
    // "Channel" is default, allow "Group" and future categories
    // ["1", "thru", "10", "+", "20", "@", "3200"];
    this.selection = this.getRangeAndAddAdditionals();
    console.log("here", this.selection);
  }

  // Then "thru" button pressed, selects items in a range.
  // "1", "thru", "3" --> [1,2,3]
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
    let directive = this.getDirectiveButtonEvent();

    if (!directive) {
      if (this.profileTarget === ProfileTarget.DIMMER) {
        directive = {
          value: parseInt(
            this.getKeypadValues()
              .slice(this.getKeypadValues().length - 2)
              .join(""),
            10,
          ),
        };
        this.valueDirective = directive?.value;

        console.log({ directive });
      } else {
        console.log("From getValueDirective No directive");
      }
      return;
    }
    this.valueDirective = directive.value;
  }

  getProfileTarget() {
    const directive = this.getDirectiveButtonEvent();
    if (!directive) {
      // TODO default profile target to dimmer
      // TODO allow selection of color temp and tint
      console.log("Default to Dimmer");
      this.profileTarget = ProfileTarget.DIMMER;

      return;
    }
    this.profileTarget = directive.profileTarget;
  }

  getDirectiveButtonEvent() {
    const directive = this.commandEvents.find(
      (event) => event.type === Buttons.DIRECT_ACTION_BUTTON,
    );

    if (!directive) {
      console.log("No direct action button");
      return null;
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
    console.log({ buildingRange });

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

    console.log({ result });

    return result;
  }

  static makeDummyButton(idx: number): KeyPadButton {
    return {
      id: `MergedKeyPadButton${idx}`,
      type: Buttons.KEYPAD_BUTTON,
      label: "",
      styles: { background: "" },
    };
  }

  oneChannelSelection() {
    return (
      this.concatKeyPadEntries().filter(
        (entry) => entry.type === Buttons.KEYPAD_BUTTON,
      ).length === 1
    );
  }

  // check if @ was pressed
  // take all KEYPAD entries after it, and join together
  // check if profile target is dimmer, then limit to 100 or less

  indexOfAtPress() {
    return this.commandEvents.findLastIndex(
      (btnPress) => btnPress.label === COMMAND.AT_SIGN,
    );
  }

  getKeypadValues() {
    if (this.indexOfAtPress() === -1) {
      return [];
    }

    const atSignIdx = this.indexOfAtPress();

    return this.commandEvents
      .slice(atSignIdx)
      .filter((btn) => btn.type === Buttons.KEYPAD_BUTTON)
      .map((keypadBtn) => parseInt(keypadBtn.label, 10));
  }
}

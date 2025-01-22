import { range } from "lodash";

import { ActionObject } from "./types/command-line-types.ts";
import ProfileAdapter from "../adapters/profile-adapter.ts";
import HistoryStack from "../history-stack.ts";
import {
  Buttons,
  COMMAND,
  ControlButton,
  DirectActionButton,
  ComposedValueButton,
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

  // not implemented
  private checkUndoEvent(): boolean {
    return (
      this.commandEvents.filter((event) =>
        event.label.toLowerCase().match("undo"),
      ).length > 0
    );
  }

  // not implemented
  private addToHistory(): void {
    this.history.add(this.commandEvents);
  }

  private buildCommandArray() {
    return this.concatKeyPadEntries().map((event) => event.label.toLowerCase());
  }

  // "Channel" is default, allow "Group" and future categories
  // ["1", "thru", "10", "+", "20", "@", "3200"];
  private buildSelectionArray() {
    this.selection = this.getRangeAndAddAdditionals();
  }

  // Then "thru" button pressed, selects items in a range.
  // "1", "thru", "3" --> [1,2,3]
  private getRange() {
    const labelArray = this.buildCommandArray();
    const index = labelArray.indexOf("thru"); // handles one instnace of 'thru' press for now

    if (index === -1) {
      return -1;
    }
    return range(
      parseInt(labelArray[index - 1], 10),
      parseInt(labelArray[index + 1], 10) + 1,
    );
  }

  // Concats value inputs for setting a level, ie not DirectAction
  private buildValueFromKeypadInput() {
    return parseInt(this.getKeypadValues().join(""), 10);
  }

  private getValueDirective() {
    let directive: DirectActionButton | ComposedValueButton | null =
      this.getDirectiveButtonEvent();

    if (!directive) {
      directive = this.buildValueDirectiveFromInputs();
    }

    console.log({ directive }); // will need to show input values in UI eventually
    this.valueDirective = directive.value;
  }

  private getProfileTarget() {
    const directive = this.getDirectiveButtonEvent();

    if (!directive) {
      const button = this.getProfileTargetWithoutDirectPress();
      if (button?.label.toLowerCase() === "color temp") {
        this.profileTarget = ProfileTarget.COLOR_TEMP;
      }

      this.profileTarget = ProfileTarget.DIMMER;

      return;
    }
    this.profileTarget = directive.profileTarget;
  }

  private getDirectiveButtonEvent() {
    const directive = this.commandEvents.find(
      (event) => event.type === Buttons.DIRECT_ACTION_BUTTON,
    );

    return directive ?? null;
  }

  private getRangeAndAddAdditionals() {
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

  private concatKeyPadEntries() {
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

  private oneChannelSelection() {
    return (
      this.concatKeyPadEntries().filter(
        (entry) => entry.type === Buttons.KEYPAD_BUTTON,
      ).length === 1
    );
  }

  private indexOfAtPress() {
    return this.commandEvents.findLastIndex(
      (btnPress) => btnPress.label === COMMAND.AT_SIGN,
    );
  }

  private getKeypadValues() {
    if (this.indexOfAtPress() === -1) {
      return [];
    }

    const atSignIdx = this.indexOfAtPress();

    return this.commandEvents
      .slice(atSignIdx)
      .filter((btn) => btn.type === Buttons.KEYPAD_BUTTON)
      .map((keypadBtn) => parseInt(keypadBtn.label, 10));
  }

  private getProfileTargetWithoutDirectPress() {
    return this.commandEvents.findLast(
      (btn) => btn.type === Buttons.COMMAND_BUTTON,
    );
  }

  private buildValueDirectiveFromInputs(): ComposedValueButton {
    return {
      type: Buttons.COMPOSED_VALUE_BUTTON,
      value: this.buildValueFromKeypadInput(),
      profileTarget: this.profileTarget,
      label: Buttons.COMPOSED_VALUE_BUTTON,
      id: Buttons.COMPOSED_VALUE_BUTTON,
      styles: { background: "" },
    };
  }
}

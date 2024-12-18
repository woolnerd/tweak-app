/* eslint-disable no-shadow */
export enum Buttons {
  DIRECT_ACTION_BUTTON = "DIRECT_ACTION_BUTTON",
  COMMAND_BUTTON = "COMMAND_BUTTON",
  KEYPAD_BUTTON = "KEYPAD_BUTTON",
}

export enum ProfileTarget {
  DIMMER = "DIMMER",
  COLOR_TEMP = "COLOR TEMP",
  TINT = "TINT",
  CROSSFADE = "CROSSFADE",
  EMPTY = "",
}

export enum COMMAND {
  CLEAR = 999,
}

interface BaseButton {
  id: string;
  label: string;
  styles: { color: string };
}

export interface DirectActionButton extends BaseButton {
  type: Buttons.DIRECT_ACTION_BUTTON;
  value: number;
  profileTarget: ProfileTarget;
}

export interface CommandButton extends BaseButton {
  type: Buttons.COMMAND_BUTTON;
}

export interface KeyPadButton extends BaseButton {
  type: Buttons.KEYPAD_BUTTON;
}

export type ControlButton = CommandButton | DirectActionButton | KeyPadButton;

export type ButtonColumn = {
  id: string;
  buttons: ControlButton[];
};

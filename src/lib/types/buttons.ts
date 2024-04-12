// eslint-disable-next-line no-shadow
export enum Buttons {
  DIRECT_ACTION_BUTTON = "DIRECT_ACTION_BUTTON",
  COMMAND_BUTTON = "COMMAND_BUTTON",
}

interface BaseButton {
  id: string;
  label: string;
  styles: { color: string };
}

export interface DirectActionButton extends BaseButton {
  type: Buttons.DIRECT_ACTION_BUTTON;
  value: number;
}

export interface CommandButton extends BaseButton {
  type: Buttons.COMMAND_BUTTON;
}

export type ControlButton = CommandButton | DirectActionButton;

export type ButtonColumn = {
  id: string;
  buttons: ControlButton[];
};

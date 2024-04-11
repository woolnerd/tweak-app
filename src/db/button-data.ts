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

type ButtonColumn = {
  id: string;
  buttons: ControlButton[];
};

const controlPanelButtonData: ButtonColumn[] = [
  {
    id: "row1",
    buttons: [
      {
        id: "button1",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "Full",
        value: 1.0,
        styles: { color: "green" },
      },
      {
        id: "button2",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "90%",
        value: 0.9,
        styles: { color: "gray" },
      },
      {
        id: "button3",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "80%",
        value: 0.8,
        styles: { color: "gray" },
      },
      {
        id: "button4",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "75%",
        value: 0.75,
        styles: { color: "gray" },
      },
      {
        id: "button5",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "70%",
        value: 0.7,
        styles: { color: "gray" },
      },
      {
        id: "button6",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "60%",
        value: 0.6,
        styles: { color: "gray" },
      },
      {
        id: "button7",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "50%",
        value: 0.5,
        styles: { color: "gray" },
      },
      {
        id: "button8",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "40%",
        value: 0.4,
        styles: { color: "gray" },
      },
      {
        id: "button9",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "30%",
        value: 0.3,
        styles: { color: "gray" },
      },
      {
        id: "button10",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "25%",
        value: 0.25,
        styles: { color: "gray" },
      },
      {
        id: "button11",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "20%",
        value: 0.2,
        styles: { color: "gray" },
      },
      {
        id: "button12",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "10%",
        value: 0.1,
        styles: { color: "gray" },
      },
      {
        id: "button13",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "0%",
        value: 0.0,
        styles: { color: "red" },
      },
      {
        id: "button14",
        type: Buttons.COMMAND_BUTTON,
        label: "@",
        styles: { color: "gray" },
      },
      {
        id: "button15",
        type: Buttons.COMMAND_BUTTON,
        label: "Clear",
        styles: { color: "brown" },
      },
    ],
  },
  {
    id: "row2",
    buttons: [
      {
        id: "button16",
        type: Buttons.COMMAND_BUTTON,
        label: "Update",
        styles: { color: "green" },
      },
      {
        id: "button17",
        type: Buttons.COMMAND_BUTTON,
        label: "Go To Cue",
        styles: { color: "blue" },
      },
      {
        id: "button18",
        type: Buttons.COMMAND_BUTTON,
        label: "Q",
        styles: { color: "blue" },
      },
      {
        id: "button19",
        type: Buttons.COMMAND_BUTTON,
        label: "Record",
        styles: { color: "red" },
      },
      {
        id: "button20",
        type: Buttons.COMMAND_BUTTON,
        label: "Parent",
        styles: { color: "gray" },
      },
      {
        id: "button21",
        type: Buttons.COMMAND_BUTTON,
        label: "Cells Only",
        styles: { color: "gray" },
      },
      {
        id: "button22",
        type: Buttons.COMMAND_BUTTON,
        label: "Recall From",
        styles: { color: "gray" },
      },
      {
        id: "button23",
        type: Buttons.COMMAND_BUTTON,
        label: "Last",
        styles: { color: "brown" },
      },
      {
        id: "button24",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "+1",
        value: 0.01,
        styles: { color: "gray" },
      },
      {
        id: "button25",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "-1",
        value: -0.01,
        styles: { color: "gray" },
      },
      {
        id: "button26",
        type: Buttons.COMMAND_BUTTON,
        label: "+",
        styles: { color: "gray" },
      },
      {
        id: "button27",
        type: Buttons.COMMAND_BUTTON,
        label: "7",
        styles: { color: "gray" },
      },
      {
        id: "button28",
        type: Buttons.COMMAND_BUTTON,
        label: "4",
        styles: { color: "gray" },
      },
      {
        id: "button29",
        type: Buttons.COMMAND_BUTTON,
        label: "1",
        styles: { color: "red" },
      },
      {
        id: "button30",
        type: Buttons.COMMAND_BUTTON,
        label: "/",
        styles: { color: "gray" },
      },
    ],
  },
  {
    id: "row3",
    buttons: [
      {
        id: "button31",
        type: Buttons.COMMAND_BUTTON,
        label: "Oh Shit",
        styles: { color: "green" },
      },
      {
        id: "button32",
        type: Buttons.COMMAND_BUTTON,
        label: "Blank",
        styles: { color: "blue" },
      },
      {
        id: "button33",
        type: Buttons.COMMAND_BUTTON,
        label: "Blank",
        styles: { color: "blue" },
      },
      {
        id: "button34",
        type: Buttons.COMMAND_BUTTON,
        label: "Group",
        styles: { color: "blue" },
      },
      {
        id: "button35",
        type: Buttons.COMMAND_BUTTON,
        label: "OFF/ON",
        styles: { color: "gray" },
      },
      {
        id: "button36",
        type: Buttons.COMMAND_BUTTON,
        label: "Restore",
        styles: { color: "gray" },
      },
      {
        id: "button37",
        type: Buttons.COMMAND_BUTTON,
        label: "Capture",
        styles: { color: "gray" },
      },
      {
        id: "button38",
        type: Buttons.COMMAND_BUTTON,
        label: "Select Last",
        styles: { color: "brown" },
      },
      {
        id: "button39",
        type: Buttons.COMMAND_BUTTON,
        label: "Sneak",
        styles: { color: "green" },
      },
      {
        id: "button40",
        type: Buttons.COMMAND_BUTTON,
        label: "Time",
        styles: { color: "gray" },
      },
      {
        id: "button41",
        type: Buttons.COMMAND_BUTTON,
        label: "Thru",
        styles: { color: "gray" },
      },
      {
        id: "button42",
        type: Buttons.COMMAND_BUTTON,
        label: "8",
        styles: { color: "gray" },
      },
      {
        id: "button43",
        type: Buttons.COMMAND_BUTTON,
        label: "5",
        styles: { color: "gray" },
      },
      {
        id: "button44",
        type: Buttons.COMMAND_BUTTON,
        label: "2",
        styles: { color: "red" },
      },
      {
        id: "button45",
        type: Buttons.COMMAND_BUTTON,
        label: "0",
        styles: { color: "gray" },
      },
    ],
  },
  {
    id: "row4",
    buttons: [
      {
        id: "button46",
        type: Buttons.COMMAND_BUTTON,
        label: "Xfade Max",
        styles: { color: "green" },
      },
      {
        id: "button47",
        type: Buttons.COMMAND_BUTTON,
        label: "Xfade Min",
        styles: { color: "blue" },
      },
      {
        id: "button48",
        type: Buttons.COMMAND_BUTTON,
        label: "+ 1/8 G",
        styles: { color: "blue" },
      },
      {
        id: "button49",
        type: Buttons.COMMAND_BUTTON,
        label: "Tint Home",
        styles: { color: "blue" },
      },
      {
        id: "button50",
        type: Buttons.COMMAND_BUTTON,
        label: "- 1/8 G",
        styles: { color: "gray" },
      },
      {
        id: "button51",
        type: Buttons.COMMAND_BUTTON,
        label: "ID",
        styles: { color: "gray" },
      },
      {
        id: "button52",
        type: Buttons.COMMAND_BUTTON,
        label: "Parameters",
        styles: { color: "gray" },
      },
      {
        id: "button53",
        type: Buttons.COMMAND_BUTTON,
        label: "Next",
        styles: { color: "brown" },
      },
      {
        id: "button54",
        type: Buttons.COMMAND_BUTTON,
        label: "+5",
        styles: { color: "green" },
      },
      {
        id: "button55",
        type: Buttons.COMMAND_BUTTON,
        label: "-5",
        styles: { color: "gray" },
      },
      {
        id: "button56",
        type: Buttons.COMMAND_BUTTON,
        label: "-",
        styles: { color: "gray" },
      },
      {
        id: "button57",
        type: Buttons.COMMAND_BUTTON,
        label: "9",
        styles: { color: "gray" },
      },
      {
        id: "button58",
        type: Buttons.COMMAND_BUTTON,
        label: "6",
        styles: { color: "gray" },
      },
      {
        id: "button59",
        type: Buttons.COMMAND_BUTTON,
        label: "3",
        styles: { color: "red" },
      },
      {
        id: "button60",
        type: Buttons.COMMAND_BUTTON,
        label: ".",
        styles: { color: "gray" },
      },
    ],
  },
  {
    id: "row5",
    buttons: [
      {
        id: "button61",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "CCT Max",
        value: 10000,
        styles: { color: "green" },
      },
      {
        id: "button62",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "6000",
        value: 6000,
        styles: { color: "blue" },
      },
      {
        id: "button63",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "5600",
        value: 5600,
        styles: { color: "blue" },
      },
      {
        id: "button64",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "4200",
        value: 4200,
        styles: { color: "yellow" },
      },
      {
        id: "button65",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "3800",
        value: 3800,
        styles: { color: "yellow" },
      },
      {
        id: "button66",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "3200",
        value: 3200,
        styles: { color: "yellow" },
      },
      {
        id: "button67",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "2800",
        value: 2800,
        styles: { color: "orange" },
      },
      {
        id: "button68",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "2500",
        value: 2500,
        styles: { color: "orange" },
      },
      {
        id: "button69",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "2200",
        value: 2200,
        styles: { color: "orange" },
      },
      {
        id: "button70",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "2000",
        value: 2000,
        styles: { color: "orange" },
      },
      {
        id: "button71",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "CCT Min",
        value: 1000,
        styles: { color: "gray" },
      },
      {
        id: "button72",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "+100CCT",
        value: 100,
        styles: { color: "gray" },
      },
      {
        id: "button73",
        type: Buttons.COMMAND_BUTTON,
        label: "Color Temp",
        styles: { color: "gray" },
      },
      {
        id: "button74",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "-100CTT",
        value: -100,
        styles: { color: "red" },
      },
      {
        id: "button75",
        type: Buttons.COMMAND_BUTTON,
        label: "Enter",
        styles: { color: "gray" },
      },
    ],
  },
];

export default controlPanelButtonData;
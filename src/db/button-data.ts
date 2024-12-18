import { ButtonColumn, Buttons, ProfileTarget } from "../lib/types/buttons.ts";

const controlPanelButtonData: ButtonColumn[] = [
  {
    id: "row1",
    buttons: [
      {
        id: "button1",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "Full",
        value: 100,
        styles: { color: "green" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button2",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "90%",
        value: 90,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button3",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "80%",
        value: 80,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button4",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "75%",
        value: 75,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button5",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "70%",
        value: 70,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button6",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "60%",
        value: 60,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button7",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "50%",
        value: 50,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button8",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "40%",
        value: 40,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button9",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "30%",
        value: 30,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button10",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "25%",
        value: 25,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button11",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "20%",
        value: 20,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button12",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "10%",
        value: 10,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button13",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "0%",
        value: 0,
        styles: { color: "red" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button14",
        type: Buttons.COMMAND_BUTTON,
        label: "@",
        styles: { color: "#cfcccc" },
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
        styles: { color: "#cfcccc" },
      },
      {
        id: "button21",
        type: Buttons.COMMAND_BUTTON,
        label: "Cells Only",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button22",
        type: Buttons.COMMAND_BUTTON,
        label: "Recall From",
        styles: { color: "#cfcccc" },
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
        value: 1,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button25",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "-1",
        value: -1,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button26",
        type: Buttons.COMMAND_BUTTON,
        label: "+",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button27",
        type: Buttons.KEYPAD_BUTTON,
        label: "7",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button28",
        type: Buttons.KEYPAD_BUTTON,
        label: "4",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button29",
        type: Buttons.KEYPAD_BUTTON,
        label: "1",
        styles: { color: "red" },
      },
      {
        id: "button30",
        type: Buttons.COMMAND_BUTTON,
        label: "/",
        styles: { color: "#cfcccc" },
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
        styles: { color: "#cfcccc" },
      },
      {
        id: "button36",
        type: Buttons.COMMAND_BUTTON,
        label: "Restore",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button37",
        type: Buttons.COMMAND_BUTTON,
        label: "Capture",
        styles: { color: "#cfcccc" },
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
        styles: { color: "#cfcccc" },
      },
      {
        id: "button41",
        type: Buttons.COMMAND_BUTTON,
        label: "Thru",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button42",
        type: Buttons.KEYPAD_BUTTON,
        label: "8",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button43",
        type: Buttons.KEYPAD_BUTTON,
        label: "5",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button44",
        type: Buttons.KEYPAD_BUTTON,
        label: "2",
        styles: { color: "red" },
      },
      {
        id: "button45",
        type: Buttons.KEYPAD_BUTTON,
        label: "0",
        styles: { color: "#cfcccc" },
      },
    ],
  },
  {
    id: "row4",
    buttons: [
      {
        id: "button46",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "Xfade Max",
        value: 1,
        styles: { color: "green" },
        profileTarget: ProfileTarget.CROSSFADE,
      },
      {
        id: "button47",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "Xfade Min",
        value: 0,
        styles: { color: "blue" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button48",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "+ 1/8 G",
        value: 12.5,
        styles: { color: "blue" },
        profileTarget: ProfileTarget.TINT,
      },
      {
        id: "button49",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "Tint Home",
        value: 0,
        styles: { color: "blue" },
        profileTarget: ProfileTarget.TINT,
      },
      {
        id: "button50",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "- 1/8 G",
        value: -12.5,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.TINT,
      },
      {
        id: "button51",
        type: Buttons.COMMAND_BUTTON,
        label: "ID",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button52",
        type: Buttons.COMMAND_BUTTON,
        label: "Parameters",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button53",
        type: Buttons.COMMAND_BUTTON,
        label: "Next",
        styles: { color: "brown" },
      },
      {
        id: "button54",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "+5",
        styles: { color: "green" },
        value: 5,
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button55",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "-5",
        value: -5,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.DIMMER,
      },
      {
        id: "button56",
        type: Buttons.COMMAND_BUTTON,
        label: "-",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button57",
        type: Buttons.KEYPAD_BUTTON,
        label: "9",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button58",
        type: Buttons.KEYPAD_BUTTON,
        label: "6",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button59",
        type: Buttons.KEYPAD_BUTTON,
        label: "3",
        styles: { color: "red" },
      },
      {
        id: "button60",
        type: Buttons.KEYPAD_BUTTON,
        label: ".",
        styles: { color: "#cfcccc" },
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
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button62",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "6000",
        value: 6000,
        styles: { color: "blue" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button63",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "5600",
        value: 5600,
        styles: { color: "blue" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button64",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "4200",
        value: 4200,
        styles: { color: "yellow" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button65",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "3800",
        value: 3800,
        styles: { color: "yellow" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button66",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "3200",
        value: 3200,
        styles: { color: "yellow" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button67",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "2800",
        value: 2800,
        styles: { color: "orange" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button68",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "2500",
        value: 2500,
        styles: { color: "orange" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button69",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "2200",
        value: 2200,
        styles: { color: "orange" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button70",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "2000",
        value: 2000,
        styles: { color: "orange" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button71",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "CCT Min",
        value: 1000,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button72",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "+100CCT",
        value: 100,
        styles: { color: "#cfcccc" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button73",
        type: Buttons.COMMAND_BUTTON,
        label: "Color Temp",
        styles: { color: "#cfcccc" },
      },
      {
        id: "button74",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "-100CTT",
        value: -100,
        styles: { color: "red" },
        profileTarget: ProfileTarget.COLOR_TEMP,
      },
      {
        id: "button75",
        type: Buttons.COMMAND_BUTTON,
        label: "Confirm",
        styles: { color: "#cfcccc" },
      },
    ],
  },
];

export default controlPanelButtonData;

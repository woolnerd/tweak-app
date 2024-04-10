import { SetStateAction, Dispatch } from "react";

import {
  getManualFixtureKeys,
  getAllFixturesFromSceneKeys,
} from "./fixture-cache.ts";
import { FixtureType } from "../components/fixture.tsx";
import { FixtureAssignmentResponse } from "../components/layout-area.tsx";

type FetchCallback = () => Promise<
  | FixtureType[]
  // | {
  //     fixtureAssignmentId: number;
  //     channel: number;
  //     values: string | null;
  //     title: string | null;
  //     profileChannels: string | null;
  //     profileName: string | null;
  //     fixtureName: string | null;
  //     fixtureNotes: string | null;
  //     sceneId: number | null;
  //   }[]
  | undefined
>;

type SetCallback = (
  arr: (FixtureType | Awaited<FetchCallback>)[],
) => Dispatch<SetStateAction<FixtureAssignmentResponse>>;

export async function mergeCacheWithDBFixtures(
  selectedSceneId: number,
  fetchCallback: FetchCallback,
  setCallback: SetCallback,
) {
  try {
    const keys = await getManualFixtureKeys();
    if (keys) {
      const cachedFixtures = await getAllFixturesFromSceneKeys(
        keys,
        selectedSceneId,
      );

      const dbFixtures = await fetchCallback();

      if (cachedFixtures instanceof Array && dbFixtures instanceof Array) {
        setCallback(
          [...cachedFixtures, ...dbFixtures].sort(
            // sort by id, later use X,Y for draggable interface
            (a, b) => a.fixtureAssignmentId - b.fixtureAssignmentId,
          ),
        );
      } else {
        throw new Error();
      }

      return;
    }
    throw new Error("Something went wrong");
  } catch (err) {
    console.log(err);
  }
}

type ValueButton = number;
type ImperativeButton = string;

type ButtonType<T> = {
  styles: { color: string };
  value: T extends number ? ValueButton : ImperativeButton;
  onClick: () => any;
};

export type ControlButton = {
  id: string;
  label: string;
  styles: { color: string };
  action?: () => any;
};

type ButtonColumn = {
  id: string;
  buttons: ControlButton[];
};

export const controlPanelButtonData: ButtonColumn[] = [
  {
    id: "row1",
    buttons: [
      { id: "button1", label: "Full", styles: { color: "green" } },
      { id: "button2", label: "90%", styles: { color: "gray" } },
      { id: "button3", label: "80%", styles: { color: "gray" } },
      { id: "button4", label: "75%", styles: { color: "gray" } },
      { id: "button5", label: "70%", styles: { color: "gray" } },
      { id: "button6", label: "60%", styles: { color: "gray" } },
      { id: "button7", label: "50%", styles: { color: "gray" } },
      { id: "button8", label: "40%", styles: { color: "gray" } },
      { id: "button9", label: "30%", styles: { color: "gray" } },
      { id: "button10", label: "25%", styles: { color: "gray" } },
      { id: "button11", label: "20%", styles: { color: "gray" } },
      { id: "button12", label: "10%", styles: { color: "gray" } },
      { id: "button13", label: "0%", styles: { color: "red" } },
      { id: "button14", label: "@", styles: { color: "gray" } },
      { id: "button15", label: "Clear", styles: { color: "brown" } },
    ],
  },
  {
    id: "row2",
    buttons: [
      { id: "button16", label: "Update", styles: { color: "green" } },
      { id: "button17", label: "Go To Cue", styles: { color: "blue" } },
      { id: "button18", label: "Q", styles: { color: "blue" } },
      { id: "button19", label: "Record", styles: { color: "red" } },
      { id: "button20", label: "Parent", styles: { color: "gray" } },
      { id: "button21", label: "Cells Only", styles: { color: "gray" } },
      { id: "button22", label: "Recall From", styles: { color: "gray" } },
      { id: "button23", label: "Last", styles: { color: "brown" } },
      { id: "button24", label: "+1", styles: { color: "gray" } },
      { id: "button25", label: "-1", styles: { color: "gray" } },
      { id: "button26", label: "+", styles: { color: "gray" } },
      { id: "button27", label: "7", styles: { color: "gray" } },
      { id: "button28", label: "4", styles: { color: "gray" } },
      { id: "button29", label: "1", styles: { color: "red" } },
      { id: "button30", label: "/", styles: { color: "gray" } },
    ],
  },
  {
    id: "row3",
    buttons: [
      { id: "button31", label: "Oh Shit", styles: { color: "green" } },
      { id: "button32", label: "Blank", styles: { color: "blue" } },
      { id: "button33", label: "Blank", styles: { color: "blue" } },
      { id: "button34", label: "Group", styles: { color: "blue" } },
      { id: "button35", label: "OFF/ON", styles: { color: "gray" } },
      { id: "button36", label: "Restore", styles: { color: "gray" } },
      { id: "button37", label: "Capture", styles: { color: "gray" } },
      { id: "button38", label: "Select Last", styles: { color: "brown" } },
      { id: "button39", label: "Sneak", styles: { color: "green" } },
      { id: "button40", label: "Time", styles: { color: "gray" } },
      { id: "button41", label: "Thru", styles: { color: "gray" } },
      { id: "button42", label: "8", styles: { color: "gray" } },
      { id: "button43", label: "5", styles: { color: "gray" } },
      { id: "button44", label: "2", styles: { color: "red" } },
      { id: "button45", label: "0", styles: { color: "gray" } },
    ],
  },
  {
    id: "row4",
    buttons: [
      { id: "button46", label: "Xfade Max", styles: { color: "green" } },
      { id: "button47", label: "Xfade Min", styles: { color: "blue" } },
      { id: "button48", label: "+ 1/8 G", styles: { color: "blue" } },
      { id: "button49", label: "Tint Home", styles: { color: "blue" } },
      { id: "button50", label: "- 1/8 G", styles: { color: "gray" } },
      { id: "button51", label: "ID", styles: { color: "gray" } },
      { id: "button52", label: "Parameters", styles: { color: "gray" } },
      { id: "button53", label: "Next", styles: { color: "brown" } },
      { id: "button54", label: "+5", styles: { color: "green" } },
      { id: "button55", label: "-5", styles: { color: "gray" } },
      { id: "button56", label: "-", styles: { color: "gray" } },
      { id: "button57", label: "9", styles: { color: "gray" } },
      { id: "button58", label: "6", styles: { color: "gray" } },
      { id: "button59", label: "3", styles: { color: "red" } },
      { id: "button60", label: ".", styles: { color: "gray" } },
    ],
  },
  {
    id: "row5",
    buttons: [
      { id: "button61", label: "CCT Max", styles: { color: "green" } },
      { id: "button62", label: "6000", styles: { color: "blue" } },
      { id: "button63", label: "5600", styles: { color: "blue" } },
      { id: "button64", label: "4200", styles: { color: "yellow" } },
      { id: "button65", label: "3800", styles: { color: "yellow" } },
      { id: "button66", label: "3200", styles: { color: "yellow" } },
      { id: "button67", label: "2800", styles: { color: "orange" } },
      { id: "button68", label: "2500", styles: { color: "orange" } },
      { id: "button69", label: "2200", styles: { color: "orange" } },
      { id: "button70", label: "2000", styles: { color: "orange" } },
      { id: "button71", label: "CCT Min", styles: { color: "gray" } },
      { id: "button72", label: "+100CCT", styles: { color: "gray" } },
      { id: "button73", label: "Color Temp", styles: { color: "gray" } },
      { id: "button74", label: "-100CTT", styles: { color: "red" } },
      { id: "button75", label: "Enter", styles: { color: "gray" } },
    ],
  },
];

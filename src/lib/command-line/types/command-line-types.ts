import { ProfileTarget } from "../../types/buttons.ts";

export type ActionObject = {
  selection: number[];
  directive: number;
  profileTarget: ProfileTarget;
  complete: boolean;
};

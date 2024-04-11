import { profiles } from "@/db/schema";

interface ProfileAdapterType {
  id: number;
  channels: Record<string, number>; //dynamically get the type from the database;
  name: string;
}

export default class ProfileAdapter {
  //{"1": "red", "2": "green", "3": "blue", "4": "intensity"}
  //[ [4, 255], [1, 100], [2, 255], [3,100] ]
  profile: ProfileAdapterType;
  channels: any;

  mergeData() {
    const mergedObj = {};

    this.channels.forEach((key, level) => {
      newKey = profileValue[key];
      mergedObj[newKey] = level;
    });
    return mergedObj;
  }
}

import useFetchData from "./useFetchData.ts";
import { db } from "../../db/client.ts";
import { scenes } from "../../db/schema.ts";

export default function useFetchScenes() {
  const fetchScenes = async (): Promise<number[]> =>
    await db
      .selectDistinct({ id: scenes.id })
      .from(scenes)
      .then((res) => res.map((obj) => obj.id));

  return useFetchData(fetchScenes, []); // No dependencies
}

import useFetchData from "./useFetchData.ts";
import { db } from "../../db/client.ts";
import PatchFixtures from "../../services/patch-fixtures.ts";

export default function useFetchPatchFixtures() {
  const fetchPatchFixtures = async () => {
    const query = new PatchFixtures(db);
    return await query.getFixtureDataForPatch();
  };

  return useFetchData(fetchPatchFixtures, []);
}

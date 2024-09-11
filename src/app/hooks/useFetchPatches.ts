import useFetchData from "./useFetchData.ts";
import { db } from "../../db/client.ts";
import Patch, { PatchAfterProcess } from "../../models/patch.ts";

export default function useFetchPatches(id?: number) {
  const fetchPatches = async () => {
    const query = new Patch(db);
    return id ? await query.getById(id) : await query.getAll();
  };

  return useFetchData<PatchAfterProcess>(fetchPatches, [id]);
}

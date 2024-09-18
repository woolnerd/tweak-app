import useFetchData from "./useFetchData.ts";
import { db } from "../../db/client.ts";
import { SelectFixtureAssignment } from "../../db/types/tables.ts";
import FixtureAssignment from "../../models/fixture-assignment.ts";

export default function useFetchFixtureAssignments(id?: number | null) {
  const fetchFixtureAssignments = async () => {
    const query = new FixtureAssignment(db);
    return id ? await query.getById(id) : await query.getAll();
  };

  return useFetchData<SelectFixtureAssignment>(fetchFixtureAssignments, [id]);
}

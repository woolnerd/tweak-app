import useFetchData from "./useFetchData.ts";
import { db } from "../../db/client.ts";
import Fixture from "../../models/fixture.ts";

export default function useFetchFixtures(id?: number) {
  const fetchFixtures = async () => {
    const query = new Fixture(db);
    return id ? await query.getByManufacturerId(id) : await query.getAll();
  };

  return useFetchData(fetchFixtures, [id]);
}

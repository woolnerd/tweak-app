import useFetchData from "./useFetchData.ts";
import { db } from "../../db/client.ts";
import { SelectManufacturer } from "../../db/types/tables.ts";
import Manufacturer from "../../models/manufacturer.ts";

export default function useFetchManufacturers(id?: number) {
  const fetchManufacturers = async () => {
    const query = new Manufacturer(db);
    return id ? await query.getById(id) : await query.getAll();
  };

  return useFetchData<SelectManufacturer>(fetchManufacturers, [id]);
}

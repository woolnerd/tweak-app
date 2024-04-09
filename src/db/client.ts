import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import * as schema from "./schema";

let expoDb;

// if (process.env.NODE_ENV !== "test") {
expoDb = openDatabaseSync("dev.db");
// } else {
//   expoDb = jest.mock("drizzle-orm/expo-sqlite");
// }

export const db = drizzle(expoDb, { schema });

module.exports = { db };

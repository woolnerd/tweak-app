import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";

import * as schema from "./schema";

let expoDb;

expoDb = openDatabaseSync("dev.db");

export const db = drizzle(expoDb, { schema });

module.exports = { db };

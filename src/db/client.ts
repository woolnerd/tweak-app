/* eslint-disable import/no-import-module-exports */
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";

import * as schema from "./schema.ts";

const expoDb = openDatabaseSync("dev.db");

// eslint-disable-next-line import/prefer-default-export
export const db = drizzle(expoDb, { schema });

module.exports = { db };

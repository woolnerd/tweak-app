import { drizzle } from "drizzle-orm/expo-sqlite"
import { openDatabaseSync } from "expo-sqlite/next"
import { fixtures } from "./schema"

const expoDb = openDatabaseSync("dev.db")

export const db = drizzle(expoDb)

import { drizzle } from "drizzle-orm/expo-sqlite"
import { openDatabaseSync } from "expo-sqlite/next"

const expoDb = openDatabaseSync("dev.db")

export const db = drizzle(expoDb)

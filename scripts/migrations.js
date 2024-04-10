import { migrate } from "drizzle-orm/expo-sqlite/migrator";

import migrations from "../drizzle/migrations.js";

const { db } = require("../src/db/client.ts");

export default async function runMigrations() {
  try {
    await migrate(db, migrations);
    console.log("🚀 Migrations ran successfully!");
  } catch (err) {
    if (err instanceof Error) {
      console.error(`🚨 Error running migrations: ${err.message}`);
    }

    process.exit(1);
  }
}

runMigrations();

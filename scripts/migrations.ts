import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { db } from "../src/db/client";
import migrations from "drizzle/migrations";
const main = async () => {
  try {
    await migrate(db, migrations);
    console.log("🚀 Migrations ran successfully!");
  } catch (err) {
    if (err instanceof Error) {
      console.error(`🚨 Error running migrations: ${err.message}`);
    }

    process.exit(1);
  }
};

void main();

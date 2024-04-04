const { migrate } = require("drizzle-orm/expo-sqlite/migrator");
const { db } = require("../src/db/client")
const { migrations }  = require("drizzle/migrations");
const main = async () => {
  try {
    // await migrate(db, migrations);
    console.log("🚀 Migrations ran successfully!");
  } catch (err) {
    if (err instanceof Error) {
      console.error(`🚨 Error running migrations: ${err.message}`);
    }

    process.exit(1);
  }
};

void main();

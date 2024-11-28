import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

import runMigrations from "../../../scripts/migrations.ts";
import seedDatabase from "../../../scripts/seedDatabase.ts";

const CURRENT_SEED_VERSION = "1";
const CURRENT_MIGRATION_VERSION = "1";
const PRINT_DB_DIRECTORY = true; // update to true for DB printout

export default function useInitialize() {
  const [migrationsRan, setMigrationsRan] = useState(false);

  useEffect(() => {
    const runMigrationsOnInitialStartup = async () => {
      try {
        const storedMigrationVersion =
          await AsyncStorage.getItem("migrationVersion");

        if (
          !migrationsRan &&
          storedMigrationVersion !== CURRENT_MIGRATION_VERSION
        ) {
          console.log("Starting migration process...");

          if (!storedMigrationVersion) {
            console.log("Running Migration...");
            await runMigrations();
            console.log("Migration completed.");
            setMigrationsRan(true);
          }
          await AsyncStorage.setItem(
            "migrationVersion",
            CURRENT_MIGRATION_VERSION,
          );
          console.log("All migrations completed successfully.");
        } else {
          console.log("No migrations needed. Database is up-to-date.");
        }
      } catch (error) {
        console.error("Error during migration:", error);
      }
    };

    runMigrationsOnInitialStartup();
  }, [migrationsRan]);

  useEffect(() => {
    const runSeedsOnInitialStartup = async () => {
      try {
        const seedVersion = await AsyncStorage.getItem("databaseSeedVersion");
        if (migrationsRan && seedVersion !== CURRENT_SEED_VERSION) {
          console.log("Seeding database...");
          await seedDatabase();
          await AsyncStorage.setItem(
            "databaseSeedVersion",
            CURRENT_SEED_VERSION,
          );
          console.log("Database seeding completed");
        } else {
          console.log("Database is already at the current seed version");
        }
      } catch (error) {
        console.error("Error during initial app setup:", error);
      }
    };
    runSeedsOnInitialStartup();
  }, [migrationsRan]);

  if (PRINT_DB_DIRECTORY) {
    console.log(FileSystem.documentDirectory);
  }
}

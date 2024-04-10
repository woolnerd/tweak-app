import { db } from "../src/db/client.ts";
import * as schema from "../src/db/schema.ts";
import { seeds } from "../src/db/seeds.ts";

const main = async () => {
  try {
    seeds.fixtureAssignments.forEach(async (assignment) => {
      await db.insert(schema.fixtureAssignments).values(assignment);
    });

    seeds.fixtures.forEach(async (fixture) => {
      await db.insert(schema.fixtures).values(fixture);
    });

    seeds.manufacturers.forEach(async (manufacturer) => {
      await db.insert(schema.manufacturers).values(manufacturer);
    });

    seeds.patches.forEach(async (patch) => {
      await db.insert(schema.patches).values(patch);
    });

    seeds.profiles.forEach(async (profile) => {
      await db.insert(schema.profiles).values(profile);
    });

    seeds.scenes.forEach(async (scene) => {
      await db.insert(schema.scenes).values(scene);
    });

    seeds.shows.forEach(async (show) => {
      await db.insert(schema.shows).values(show);
    });

    seeds.scenesToFixtureAssignments.forEach(async (join) => {
      await db.insert(schema.scenesToFixtureAssignments).values(join);
    });

    console.log("🚀 Seeding ran successfully!");
  } catch (err) {
    if (err instanceof Error) {
      console.error(`🚨 Error running seeds: ${err.message}`);
    }

    process.exit(1);
  }
};

main();

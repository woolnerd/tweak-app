/* eslint-disable drizzle/enforce-delete-with-where */
import { sql } from "drizzle-orm";
import { db } from "../src/db/client.ts";
import * as schema from "../src/db/schema.ts";
import { seeds } from "../src/db/seeds.ts";

export default async function seedDatabase() {
  try {
    Promise.all([
      db.delete(schema.shows),
      db.delete(schema.fixtures),
      db.delete(schema.fixtureAssignments),
      db.delete(schema.scenes),
      db.delete(schema.manufacturers),
      db.delete(schema.profiles),
      db.delete(schema.scenesToFixtureAssignments),
      db.delete(schema.patches),
      db.run(sql`DELETE FROM sqlite_sequence WHERE name='fixtureAssignments';`),
      db.run(sql`DELETE FROM sqlite_sequence WHERE name='shows';`),
      db.run(sql`DELETE FROM sqlite_sequence WHERE name='fixtures';`),
      db.run(sql`DELETE FROM sqlite_sequence WHERE name='scenes';`),
      db.run(sql`DELETE FROM sqlite_sequence WHERE name='manufacturers';`),
      db.run(sql`DELETE FROM sqlite_sequence WHERE name='profiles';`),
      db.run(
        sql`DELETE FROM sqlite_sequence WHERE name='scenesToFixtureAssignments';`,
      ),
      db.run(sql`DELETE FROM sqlite_sequence WHERE name='patches';`),
    ]).then((res) => console.log("Deletion Success"));
  } catch (error) {
    console.log("Delete failed", error);
  }

  try {
    await Promise.all(
      seeds.manufacturers.map(async (manufacturer) => {
        await db.insert(schema.manufacturers).values(manufacturer);
      }),
    );

    await Promise.all(
      seeds.fixtures.map(async (fixture) => {
        await db.insert(schema.fixtures).values(fixture);
      }),
    );

    await Promise.all(
      seeds.shows.map(async (show) => {
        await db.insert(schema.shows).values(show);
      }),
    );

    await Promise.all(
      seeds.fixtureAssignments.map(async (assignment) => {
        await db.insert(schema.fixtureAssignments).values(assignment);
      }),
    );

    await Promise.all(
      seeds.patches.map(async (patch) => {
        await db.insert(schema.patches).values(patch);
      }),
    );

    await Promise.all(
      seeds.profiles.map(async (profile) => {
        await db.insert(schema.profiles).values(profile);
      }),
    );

    await Promise.all(
      seeds.scenes.map(async (scene) => {
        await db.insert(schema.scenes).values(scene);
      }),
    );

    await Promise.all(
      seeds.scenesToFixtureAssignments.map(async (join) => {
        await db.insert(schema.scenesToFixtureAssignments).values(join);
      }),
    );

    console.log("🚀 Seeding ran successfully!");
  } catch (err) {
    if (err instanceof Error) {
      console.error(`🚨 Error running seeds: ${err.message}`);
    }

    process.exit(1);
  }
}

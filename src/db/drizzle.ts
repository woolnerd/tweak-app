import * as schema from '@/db/schema';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";

const expoDb = openDatabaseSync("dev.db");
export const db = drizzle(expoDb, { schema });

export type FixtureSelect = typeof schema.fixtures.$inferSelect
export type FixtureInsert= typeof schema.fixtures.$inferInsert

export type ManufacturerSelect = typeof schema.manufacturers.$inferSelect
export type ManufacturerInsert= typeof schema.manufacturers.$inferInsert

export type ProfileSelect = typeof schema.profiles.$inferSelect
export type ProfileInsert = typeof schema.profiles.$inferInsert

export type FixtureAssignmentsSelect = typeof schema.fixtureAssignments.$inferSelect
export type FixtureAssignmentsInsert = typeof schema.fixtureAssignments.$inferInsert

export type ScenesSelect = typeof schema.scenes.$inferSelect
export type ScenesInsert= typeof schema.scenes.$inferInsert

export type ShowsSelect = typeof schema.shows.$inferSelect
export type ShowsInsert= typeof schema.shows.$inferInsert

export type PatchesSelect = typeof schema.patches.$inferSelect
export type PatchesInsert= typeof schema.patches.$inferInsert

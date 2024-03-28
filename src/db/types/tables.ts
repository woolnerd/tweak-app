import { fixtures, manufacturers, profiles, fixtureAssignments, scenes, shows, patches  } from "../schema";

export type SelectFixture = typeof fixtures.$inferSelect
export type InsertFixture = typeof fixtures.$inferInsert

export type SelectManufacturer = typeof manufacturers.$inferSelect
export type InsertManufacturer= typeof manufacturers.$inferInsert

export type SelectProfile = typeof profiles.$inferSelect
export type InsertProfile = typeof profiles.$inferInsert

export type SelectFixtureAssignments = typeof fixtureAssignments.$inferSelect
export type InsertFixtureAssignments = typeof fixtureAssignments.$inferInsert

export type SelectScenes = typeof scenes.$inferSelect
export type InsertScenes = typeof scenes.$inferInsert

export type SelectShows = typeof shows.$inferSelect
export type InsertShows = typeof shows.$inferInsert

export type SelectPatches = typeof patches.$inferSelect
export type InsertPatches = typeof patches.$inferInsert

import { fixtures, manufacturers, profiles, fixtureAssignments, scenes, shows, patches  } from "../schema";

export type SelectFixture = typeof fixtures.$inferSelect
export type InsertFixture = typeof fixtures.$inferInsert

export type SelectManufacturer = typeof manufacturers.$inferSelect
export type InsertManufacturer= typeof manufacturers.$inferInsert

export type SelectProfile = typeof profiles.$inferSelect
export type InsertProfile = typeof profiles.$inferInsert

export type SelectFixtureAssignment = typeof fixtureAssignments.$inferSelect
export type InsertFixtureAssignment = typeof fixtureAssignments.$inferInsert

export type SelectScene = typeof scenes.$inferSelect
export type InsertScene = typeof scenes.$inferInsert

export type SelectShow = typeof shows.$inferSelect
export type InsertShow = typeof shows.$inferInsert

export type SelectPatch = typeof patches.$inferSelect
export type InsertPatch = typeof patches.$inferInsert

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const fixtures = sqliteTable("fixtures", {
  id: integer("id").primaryKey({autoIncrement: true}),
  name: text("name").notNull(),
  notes: text("notes"),
  assigned: integer("assigned", { mode: 'boolean' }).default(false),
});

export const fixturesRelations = relations(fixtures, ({many}) => ({
  fixtureAssignments: many(fixtureAssignments),
  patches: many(patches),
  manufacturers: many(manufacturers),
  profiles: many(profiles)
}))

export const manufacturers = sqliteTable("manufacturers", {
  id: integer("id").primaryKey({autoIncrement: true}),
  name: text("name").notNull(),
  notes: text("notes"),
  website: text("website"),
})

export const manufacturersRelations = relations(manufacturers, ({many}) => ({
  fixtures: many(fixtures)
}))

export const patches = sqliteTable("patches", {
  id: integer("id").primaryKey({autoIncrement: true}),
  startAddress: integer("start_address").notNull(),
  endAddress: integer("end_address").notNull(),
})

export const patchesRelations = relations(patches, ({many }) => ({
  fixtures: many(fixtures),
  profiles: many(profiles),
  shows: many(shows),
}))

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({autoIncrement: true}),
  name: text("name"),
  channels: text("channels"),
  channelCount: integer("channel_count").notNull()
})

export const profilesRelations = relations(profiles, ({ many }) => ({
  fixtures: many(fixtures),
  fixtureAssignments: many(fixtureAssignments),
  patches: many(patches)
}))

export const fixtureAssignments = sqliteTable("fixtureAssignments", {
  id: integer("id").primaryKey({autoIncrement: true}),
  title: text("title"),
  channel: integer("channel").notNull(),
  value: integer("value").notNull().default(0),
  fixtureId: integer("fixture_id"),
  profileId: integer("profile_id")
})

export const fixtureAssignmentRelations = relations(fixtureAssignments, ({ one }) => ({
  fixture: one(fixtures, {
    fields: [fixtureAssignments.fixtureId],
    references: [fixtures.id],
  }),
  profile: one(profiles, {
    fields: [fixtureAssignments.profileId],
    references: [profiles.id],
  }),
}));

export const scenes = sqliteTable("scenes", {
  id: integer("id").primaryKey({autoIncrement: true}),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  showId: integer("show_id").notNull()
})

export const scenesRelations = relations(scenes, ({ many, one }) => ({
  fixtureAssignments: many(fixtureAssignments),
  show: one(shows, {
    fields: [scenes.showId],
    references: [shows.id]
  })
}))

export const shows = sqliteTable("shows", {
  id: integer("id").primaryKey({autoIncrement: true}),
  name: text("name"),
  createdAt: text("created_at").default(sql`(CURRENT_TIME)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIME)`),
})

export const showsRelations = relations(shows, ({ many }) => ({
  patches: many(patches),
  scenes: many(scenes)
}))

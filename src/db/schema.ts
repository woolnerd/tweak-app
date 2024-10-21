import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  primaryKey,
  text,
  integer,
  index,
} from "drizzle-orm/sqlite-core";

export const fixtures = sqliteTable(
  "fixtures",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    notes: text("notes").notNull(),
    manufacturerId: integer("manufacturer_id").references(
      () => manufacturers.id,
    ),
    colorTempRangeLow: integer("color_temp_range_low"),
    colorTempRangeHigh: integer("color_temp_range_high"),
  },
  (table) => ({
    manufacturerIdIndex: index("manufacturer_id_index").on(
      table.manufacturerId,
    ),
    idIndex: index("id_index").on(table.id),
  }),
);

export const fixturesRelations = relations(fixtures, ({ one, many }) => ({
  fixtureAssignments: many(fixtureAssignments),
  patches: many(patches),
  profiles: many(profiles),
  manufacturer: one(manufacturers, {
    fields: [fixtures.manufacturerId],
    references: [manufacturers.id],
  }),
}));

export const manufacturers = sqliteTable("manufacturers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  notes: text("notes").notNull().default(""),
  website: text("website").notNull().default(""),
});

export const manufacturersRelations = relations(manufacturers, ({ many }) => ({
  fixtures: many(fixtures),
}));

export const patches = sqliteTable("patches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startAddress: integer("start_address").notNull(),
  fixtureId: integer("fixture_id").notNull(),
  profileId: integer("profile_id").notNull(),
  showId: integer("show_id").notNull(),
});

export const patchesRelations = relations(patches, ({ one, many }) => ({
  fixture: one(fixtures, {
    fields: [patches.fixtureId],
    references: [fixtures.id],
  }),
  profile: one(profiles, {
    fields: [patches.profileId],
    references: [profiles.id],
  }),
  show: one(shows, {
    fields: [patches.showId],
    references: [shows.id],
  }),
}));

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().default(""),
  channels: text("channels").notNull().default("{}"),
  fixtureId: integer("fixture_id").notNull(),
  channelPairs16Bit: text("channel_pairs_16_bit").default("[]").notNull(),
});

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  fixture: one(fixtures, {
    fields: [profiles.fixtureId],
    references: [fixtures.id],
  }),
  fixtureAssignments: many(fixtureAssignments),
  patches: many(patches),
}));

export const fixtureAssignments = sqliteTable(
  "fixture_assignments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    channel: integer("channel").notNull(),
    fixtureId: integer("fixture_id").notNull(),
    profileId: integer("profile_id").notNull(),
    patchId: integer("patch_id")
      .notNull()
      .references(() => patches.id, { onDelete: "cascade" }),
  },
  (table) => ({
    fixtureIdIndex: index("fixture_id_index").on(table.fixtureId),
    profileIdIndex: index("profile_id_index").on(table.profileId),
    patchIdIndex: index("patch_id_index").on(table.patchId),
    channelIndex: index("channel_index").on(table.channel),
  }),
);

export const fixtureAssignmentRelations = relations(
  fixtureAssignments,
  ({ one, many }) => ({
    fixture: one(fixtures, {
      fields: [fixtureAssignments.fixtureId],
      references: [fixtures.id],
    }),
    profile: one(profiles, {
      fields: [fixtureAssignments.profileId],
      references: [profiles.id],
    }),
    scenesToFixtureAssignments: many(scenesToFixtureAssignments),
    patch: one(patches, {
      fields: [fixtureAssignments.patchId],
      references: [patches.id],
    }),
  }),
);

export const scenes = sqliteTable("scenes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  order: integer("order").notNull().unique(),
  showId: integer("show_id").notNull(),
  timeRate: integer("time_rate").notNull().default(5),
});

export const scenesRelations = relations(scenes, ({ many, one }) => ({
  scenesToFixtureAssignments: many(scenesToFixtureAssignments),
  show: one(shows, {
    fields: [scenes.showId],
    references: [shows.id],
  }),
}));

export const scenesToFixtureAssignments = sqliteTable(
  "scenes_to_fixture_assignments",
  {
    fixtureAssignmentId: integer("fixture_assignment_id")
      .notNull()
      .references(() => fixtureAssignments.id, { onDelete: "cascade" }),
    sceneId: integer("scene_id")
      .notNull()
      .references(() => scenes.id, { onDelete: "cascade" }),
    values: text("values").notNull().default("[]"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.fixtureAssignmentId, table.sceneId] }),
    fixtureAssignmentAdIndex: index("fixture_assignment_id").on(
      table.fixtureAssignmentId,
    ),
    sceneIdIndex: index("scene_id_index").on(table.sceneId),
  }),
);

export const scenesToFixturesAssignmentsRelations = relations(
  scenesToFixtureAssignments,
  ({ one }) => ({
    fixtureAssignment: one(fixtureAssignments, {
      fields: [scenesToFixtureAssignments.fixtureAssignmentId],
      references: [fixtureAssignments.id],
    }),
    scene: one(scenes, {
      fields: [scenesToFixtureAssignments.sceneId],
      references: [scenes.id],
    }),
  }),
);

export const shows = sqliteTable("shows", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().default(""),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIME)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIME)`),
});

export const showsRelations = relations(shows, ({ many }) => ({
  patches: many(patches),
  scenes: many(scenes),
}));

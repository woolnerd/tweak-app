CREATE TABLE `fixture_assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`channel` integer NOT NULL,
	`fixture_id` integer NOT NULL,
	`profile_id` integer NOT NULL,
	`patch_id` integer NOT NULL,
	FOREIGN KEY (`patch_id`) REFERENCES `patches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `fixtures` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`notes` text NOT NULL,
	`manufacturer_id` integer,
	`color_temp_range_low` integer,
	`color_temp_range_high` integer,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `manufacturers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `patches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_address` integer NOT NULL,
	`fixture_id` integer NOT NULL,
	`profile_id` integer NOT NULL,
	`show_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`channels` text DEFAULT '{}' NOT NULL,
	`fixture_id` integer NOT NULL,
	`channel_pairs_16_bit` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `scenes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`order` integer NOT NULL,
	`show_id` integer NOT NULL,
	`time_rate` integer DEFAULT 5 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `scenes_to_fixture_assignments` (
	`fixture_assignment_id` integer NOT NULL,
	`scene_id` integer NOT NULL,
	`values` text DEFAULT '[]' NOT NULL,
	PRIMARY KEY(`fixture_assignment_id`, `scene_id`),
	FOREIGN KEY (`fixture_assignment_id`) REFERENCES `fixture_assignments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`scene_id`) REFERENCES `scenes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `shows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIME) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIME) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `fixture_id_index` ON `fixture_assignments` (`fixture_id`);--> statement-breakpoint
CREATE INDEX `profile_id_index` ON `fixture_assignments` (`profile_id`);--> statement-breakpoint
CREATE INDEX `patch_id_index` ON `fixture_assignments` (`patch_id`);--> statement-breakpoint
CREATE INDEX `channel_index` ON `fixture_assignments` (`channel`);--> statement-breakpoint
CREATE INDEX `manufacturer_id_index` ON `fixtures` (`manufacturer_id`);--> statement-breakpoint
CREATE INDEX `id_index` ON `fixtures` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `manufacturers_name_unique` ON `manufacturers` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `scenes_order_unique` ON `scenes` (`order`);--> statement-breakpoint
CREATE INDEX `fixture_assignment_id` ON `scenes_to_fixture_assignments` (`fixture_assignment_id`);--> statement-breakpoint
CREATE INDEX `scene_id_index` ON `scenes_to_fixture_assignments` (`scene_id`);

CREATE TABLE `fixtureAssignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`channel` integer NOT NULL,
	`value` integer DEFAULT 0 NOT NULL,
	`fixture_id` integer,
	`profile_id` integer
);
--> statement-breakpoint
CREATE TABLE `fixtures` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`assigned` integer DEFAULT false,
	`manufacturer_id` integer,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `manufacturers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`website` text
);
--> statement-breakpoint
CREATE TABLE `patches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_address` integer NOT NULL,
	`end_address` integer NOT NULL,
	`fixture_id` integer NOT NULL,
	`profile_id` integer NOT NULL,
	`show_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`channels` text,
	`channel_count` integer NOT NULL,
	`fixture_id` integer
);
--> statement-breakpoint
CREATE TABLE `scenes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`order` integer NOT NULL,
	`show_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `scenes_to_fixture_assignments` (
	`fixture_assignment_id` integer NOT NULL,
	`scene_id` integer NOT NULL,
	PRIMARY KEY(`fixture_assignment_id`, `scene_id`),
	FOREIGN KEY (`fixture_assignment_id`) REFERENCES `fixtureAssignments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`scene_id`) REFERENCES `scenes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `shows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`created_at` text DEFAULT (CURRENT_TIME),
	`updated_at` text DEFAULT (CURRENT_TIME)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `manufacturers_name_unique` ON `manufacturers` (`name`);
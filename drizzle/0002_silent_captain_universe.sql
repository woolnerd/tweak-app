ALTER TABLE `fixtureAssignments` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `patches` DROP COLUMN `end_address`;--> statement-breakpoint
ALTER TABLE `patches` DROP COLUMN `fixture_assignment_id`;--> statement-breakpoint
ALTER TABLE `profiles` DROP COLUMN `channel_count`;--> statement-breakpoint
ALTER TABLE `profiles` DROP COLUMN `is_16_bit`;
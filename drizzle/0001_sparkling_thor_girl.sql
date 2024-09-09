ALTER TABLE scenes_to_fixture_assignments ADD `values` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `fixtureAssignments` DROP COLUMN `values`;
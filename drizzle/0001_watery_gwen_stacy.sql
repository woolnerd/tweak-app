ALTER TABLE fixtureAssignments ADD `values` text;--> statement-breakpoint
CREATE UNIQUE INDEX `scenes_order_unique` ON `scenes` (`order`);--> statement-breakpoint
ALTER TABLE `fixtureAssignments` DROP COLUMN `value`;--> statement-breakpoint
ALTER TABLE `fixtures` DROP COLUMN `assigned`;
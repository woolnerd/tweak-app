ALTER TABLE fixtureAssignments ADD `patch_id` integer;--> statement-breakpoint
ALTER TABLE patches ADD `fixture_assignment_id` integer;
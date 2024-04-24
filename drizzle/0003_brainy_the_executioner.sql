ALTER TABLE fixtures ADD `color_temp_range_low` integer;--> statement-breakpoint
ALTER TABLE fixtures ADD `color_temp_range_high` integer;--> statement-breakpoint
ALTER TABLE profiles ADD `channel_pairs_16_bit` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE profiles ADD `is_16_bit` integer DEFAULT false NOT NULL;
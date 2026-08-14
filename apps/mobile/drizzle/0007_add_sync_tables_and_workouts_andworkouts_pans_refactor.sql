CREATE TABLE `sync_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`aggregate_type` text NOT NULL,
	`aggregate_id` text NOT NULL,
	`operation` text NOT NULL,
	`mutation_id` text NOT NULL,
	`local_revision` integer DEFAULT 1 NOT NULL,
	`base_server_version` integer,
	`attempt_count` integer DEFAULT 0 NOT NULL,
	`next_attempt_at` text,
	`last_error` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `local_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sync_outbox_user_aggregate_unique_idx` ON `sync_outbox` (`user_id`,`aggregate_type`,`aggregate_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sync_outbox_mutation_id_unique_idx` ON `sync_outbox` (`mutation_id`);--> statement-breakpoint
CREATE INDEX `sync_outbox_retry_idx` ON `sync_outbox` (`user_id`,`next_attempt_at`);--> statement-breakpoint
CREATE TABLE `sync_state` (
	`user_id` text PRIMARY KEY NOT NULL,
	`server_cursor` text,
	`last_synced_at` text,
	`last_attempt_at` text,
	`last_error` text,
	FOREIGN KEY (`user_id`) REFERENCES `local_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `workouts` ADD `server_version` integer;--> statement-breakpoint
ALTER TABLE `workout_templates` ADD `server_version` integer;
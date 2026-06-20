ALTER TABLE `app_users` RENAME TO `local_users`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`started_at` text NOT NULL,
	`ended_at` text,
	`local_date` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `local_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_workouts`("id", "user_id", "name", "started_at", "ended_at", "local_date", "status", "sync_status", "created_at", "updated_at", "deleted_at") SELECT "id", "user_id", "name", "started_at", "ended_at", "local_date", "status", "sync_status", "created_at", "updated_at", "deleted_at" FROM `workouts`;--> statement-breakpoint
DROP TABLE `workouts`;--> statement-breakpoint
ALTER TABLE `__new_workouts` RENAME TO `workouts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `workouts_user_id_idx` ON `workouts` (`user_id`);--> statement-breakpoint
CREATE INDEX `workouts_user_started_at_idx` ON `workouts` (`user_id`,`started_at`);--> statement-breakpoint
CREATE INDEX `workouts_user_local_date_idx` ON `workouts` (`user_id`,`local_date`);
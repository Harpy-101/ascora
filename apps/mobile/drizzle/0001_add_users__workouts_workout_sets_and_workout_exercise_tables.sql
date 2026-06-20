CREATE TABLE `app_users` (
	`id` text PRIMARY KEY NOT NULL,
	`auth_subject` text,
	`full_name` text,
	`display_name` text,
	`email` text,
	`avatar_url` text,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `local_users_auth_subject_unique` ON `app_users` (`auth_subject`);--> statement-breakpoint
CREATE TABLE `workouts` (
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
	FOREIGN KEY (`user_id`) REFERENCES `app_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `workouts_user_id_idx` ON `workouts` (`user_id`);--> statement-breakpoint
CREATE INDEX `workouts_user_started_at_idx` ON `workouts` (`user_id`,`started_at`);--> statement-breakpoint
CREATE INDEX `workouts_user_local_date_idx` ON `workouts` (`user_id`,`local_date`);--> statement-breakpoint
CREATE TABLE `workout_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `exercise_by_workout_idx` ON `workout_exercises` (`workout_id`);--> statement-breakpoint
CREATE TABLE `workout_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_exercise_id` text NOT NULL,
	`set_number` integer NOT NULL,
	`weight_in_kg` real NOT NULL,
	`reps` integer NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `set_by_workout_exercise_id_idx` ON `workout_sets` (`workout_exercise_id`);--> statement-breakpoint
DROP TABLE `db_test`;
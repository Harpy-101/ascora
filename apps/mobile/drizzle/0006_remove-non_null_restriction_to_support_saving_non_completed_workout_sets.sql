PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workout_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_exercise_id` text NOT NULL,
	`set_number` integer NOT NULL,
	`weight_in_kg` real,
	`reps` integer,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_workout_sets`("id", "workout_exercise_id", "set_number", "weight_in_kg", "reps", "completed", "created_at") SELECT "id", "workout_exercise_id", "set_number", "weight_in_kg", "reps", "completed", "created_at" FROM `workout_sets`;--> statement-breakpoint
DROP TABLE `workout_sets`;--> statement-breakpoint
ALTER TABLE `__new_workout_sets` RENAME TO `workout_sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `set_by_workout_exercise_id_idx` ON `workout_sets` (`workout_exercise_id`);
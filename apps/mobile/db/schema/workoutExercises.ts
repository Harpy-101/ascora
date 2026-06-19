import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { workouts } from "./workouts";

export const workoutExercises = sqliteTable(
  "workout_exercises",
  {
    id: text("id").primaryKey(),
    workoutId: text("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id").notNull(),
    position: integer("position").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("exercise_by_workout_idx").on(t.workoutId)],
);

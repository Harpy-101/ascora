import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { workoutExercises } from "./workoutExercises";

export const workoutSets = sqliteTable(
  "workout_sets",
  {
    id: text("id").primaryKey().notNull(),
    workoutExerciseId: text("workout_exercise_id")
      .notNull()
      .references(() => workoutExercises.id, { onDelete: "cascade" }),
    setNumber: integer("set_number").notNull(),
    weightInKg: real("weight_in_kg"),
    reps: integer("reps"),
    completed: integer("completed", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("set_by_workout_exercise_id_idx").on(t.workoutExerciseId)],
);

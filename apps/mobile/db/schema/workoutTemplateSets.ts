import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { workoutTemplateExercises } from "./workoutTemplateExercises";

export const workoutTemplateSets = sqliteTable("workout_template_sets", {
  id: text("id").primaryKey(),
  templateExerciseId: text("template_exercise_id")
    .notNull()
    .references(() => workoutTemplateExercises.id, { onDelete: "cascade" }),
  setCount: integer("set_count"),
  position: integer("position").notNull(),
  targetWeightInKg: real("targetWeightInKg"),
  targetReps: integer("targetReps"),
});

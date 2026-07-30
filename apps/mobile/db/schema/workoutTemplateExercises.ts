import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { workoutTemplates } from "./workoutTemplates";

export const workoutTemplateExercises = sqliteTable(
  "workout_template_exercises",
  {
    id: text("id").primaryKey(),
    templateId: text("template_id")
      .notNull()
      .references(() => workoutTemplates.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id").notNull(),
    exerciseName: text("exercise_name").notNull(),
    position: integer("position").notNull(),
  },
);

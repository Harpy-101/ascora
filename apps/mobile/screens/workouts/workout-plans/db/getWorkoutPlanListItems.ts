import { db } from "@/db/client";
import {
  workoutTemplateExercises,
  workoutTemplates,
  workoutTemplateSets,
} from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { WorkoutPlanListItem } from "../types";

function parseExerciseNames(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);

    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
    ) {
      return parsed;
    }

    return [];
  } catch {
    return [];
  }
}

export default async function getWorkoutPlanListItems(
  userId: string,
): Promise<WorkoutPlanListItem[]> {
  console.log("Ran search successgfullt");
  const exerciseSummary = db
    .select({
      templateId: workoutTemplateExercises.templateId,
      exerciseCount: sql<number>`count(${workoutTemplateExercises.id})`
        .mapWith(Number)
        .as("exercise_count"),
      exerciseNamesJson:
        sql<string>`json_group_array(${workoutTemplateExercises.exerciseName} order by ${workoutTemplateExercises.position})`.as(
          "exercise_names_json",
        ),
    })
    .from(workoutTemplateExercises)

    .groupBy(workoutTemplateExercises.templateId)
    .as("exercise_summary");

  // console.log("exercise summary res", exerciseSummary);

  const setSummary = db
    .select({
      templateId: workoutTemplateExercises.templateId,
      totalSets: sql<number>`sum(${workoutTemplateSets.setCount})`
        .mapWith(Number)
        .as("total_sets"),
    })
    .from(workoutTemplateExercises)
    .leftJoin(
      workoutTemplateSets,
      eq(workoutTemplateExercises.id, workoutTemplateSets.templateExerciseId),
    )
    .groupBy(workoutTemplateExercises.templateId)
    .as("set_summary");

  // const usageSummary = db.select({
  //   templateId: workouts
  // })

  // console.log("set summary", setSummary);
  const rows = await db
    .select({
      id: workoutTemplates.id,
      name: workoutTemplates.name,
      description: sql<string>`coalesce(${workoutTemplates.description}, '')`,
      exerciseCount:
        sql<number>`coalesce(${exerciseSummary.exerciseCount}, 0)`.mapWith(
          Number,
        ),
      totalSets: sql<number>`coalesce(${setSummary.totalSets}, 0)`.mapWith(
        Number,
      ),
      exerciseNamesJson: sql<string>`coalesce(${exerciseSummary.exerciseNamesJson}, '[]')`,
      updatedAt: workoutTemplates.updatedAt,
    })
    .from(workoutTemplates)
    .leftJoin(
      exerciseSummary,
      eq(exerciseSummary.templateId, workoutTemplates.id),
    )
    .leftJoin(setSummary, eq(setSummary.templateId, workoutTemplates.id))
    .where(eq(workoutTemplates.ownerId, userId))
    .orderBy(desc(workoutTemplates.updatedAt));

  console.log("rows res", rows);
  return rows.map(({ exerciseNamesJson, ...plan }) => ({
    ...plan,
    exerciseNames: parseExerciseNames(exerciseNamesJson),
  }));
}

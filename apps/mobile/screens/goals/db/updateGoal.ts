import { db } from "@/db/client";
import { GoalSchemaValues } from "../validation/goalSchema";
import { goals } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type UpdateGoalsValues = {
  goalId: string;
  userId: string;
  values: GoalSchemaValues;
};

export default async function updateGoal({
  userId,
  goalId,
  values,
}: UpdateGoalsValues) {
  const nowIso = new Date().toISOString();

  await db
    .update(goals)
    .set({
      type: values.type,
      startDate: values.startDate,
      dueDate: values.dueDate,
      targetValue: Number(values.targetValue),
      updatedAt: nowIso,
    })
    .where(and(eq(goals.userId, userId), eq(goals.id, goalId)));
}

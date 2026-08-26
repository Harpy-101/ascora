import { db } from "@/db/client";
import { goals } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type DeleteGoalValues = {
  userId: string;
  goalId: string;
};

export default async function deleteGoal({ goalId, userId }: DeleteGoalValues) {
  return await db
    .delete(goals)
    .where(and(eq(goals.userId, userId), eq(goals.id, goalId)));
}

import { db } from "@/db/client";
import { goals } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type GetGoalByIdValues = {
  userId: string;
  goalId: string;
};

export default async function getGoalById({
  goalId,
  userId,
}: GetGoalByIdValues) {
  const [goal] = await db
    .select({
      id: goals.id,
      userId: goals.userId,
      type: goals.type,
      startValue: goals.startValue,
      targetValue: goals.targetValue,
      startDate: goals.startDate,
      dueDate: goals.dueDate,
      status: goals.status,
      completedAt: goals.completedAt,
    })
    .from(goals)
    .where(and(eq(goals.userId, userId), eq(goals.id, goalId)))
    .limit(1);

  return goal;
}

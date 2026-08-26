import { db } from "@/db/client";
import { goals, weightEntries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

type GetGoalsValues = {
  userId: string;
};

export default async function getGoals({ userId }: GetGoalsValues) {
  return await db.transaction(async (tx) => {
    const rows = await tx
      .select({
        id: goals.id,
        type: goals.type,
        startValue: goals.startValue,
        targetValue: goals.targetValue,
        startDate: goals.startDate,
        dueDate: goals.dueDate,
        status: goals.status,
        completedAt: goals.completedAt,
      })
      .from(goals)
      .where(eq(goals.userId, userId));

    const [latestWeight] = await tx
      .select({
        value: weightEntries.weightKg,
      })
      .from(weightEntries)
      .where(eq(weightEntries.userId, userId))
      .orderBy(desc(weightEntries.recordedAt))
      .limit(1);

    return rows.map((goal) => {
      switch (goal.type) {
        case "weight":
          return {
            ...goal,
            latestValue: latestWeight?.value ?? null,
          };

        default:
          return {
            ...goal,
            latestValue: null,
          };
      }
    });
  });
}

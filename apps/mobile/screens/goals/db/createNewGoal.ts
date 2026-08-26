import { db } from "@/db/client";
import { createId } from "@/db/create-id";
import { goals } from "@/db/schema";
import { GoalSchemaValues } from "../validation/goalSchema";

type CreateGolsValues = {
  values: GoalSchemaValues;
  userId: string;
};

export default async function createNewGoal({
  values,
  userId,
}: CreateGolsValues) {
  const nowIso = new Date().toISOString();

  await db.insert(goals).values({
    id: createId(),
    userId: userId,
    type: values.type,
    startValue: Number(values.startValue),
    targetValue: Number(values.targetValue),
    startDate: values.startDate,
    dueDate: values.dueDate,
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  });
}

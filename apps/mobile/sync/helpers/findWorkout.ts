import { workouts } from "@/db/schema";
import { DbTransaction } from "../types";
import { and, eq } from "drizzle-orm";

export default async function findWorkout(
  tx: DbTransaction,
  workoutId: string,
  userId: string,
) {
  return await tx
    .select({
      id: workouts.id,
      serverVersion: workouts.serverVersion,
    })
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .limit(1)
    .then((res) => res[0] ?? null);
}

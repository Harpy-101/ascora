import { db } from "@/db/client";
import { workouts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function getCurrentActiveWorkout(userId: string) {
  const res = await db
    .select({
      id: workouts.id,
      name: workouts.name ?? null,
      startedAt: workouts.startedAt ?? null,
    })
    .from(workouts)
    .where(and(eq(workouts.status, "active"), eq(workouts.userId, userId)))
    .limit(1);

  return res[0] || null;
}

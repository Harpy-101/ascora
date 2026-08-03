import { db } from "@/db/client";
import { createId } from "@/db/create-id";
import { workouts } from "@/db/schema";

export default async function startEmptyWorkout(userId: string) {
  const nowIso = new Date().toISOString();
  const workoutId = createId();
  await db.insert(workouts).values({
    id: workoutId,
    userId: userId,
    name: "Default workout name",
    startedAt: nowIso,
    endedAt: null,
    localDate: "",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  return { workoutId: workoutId };
}

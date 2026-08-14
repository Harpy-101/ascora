import { z } from "zod";

const workoutSetSyncPayload = z.object({
  id: z.string(),
  setNumber: z.number(),
  weightInKg: z.number().nullable(),
  reps: z.number().nullable(),
  completed: z.boolean(),
});

const workoutExerciseSyncPayload = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  position: z.number(),
  sets: z.array(workoutSetSyncPayload),
});

export const workoutSyncPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["draft", "active", "completed", "abandoned"]),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  exercises: z.array(workoutExerciseSyncPayload),
});

import { z } from "zod";
export const workoutSummaryInsightDataSchema = z.object({
  totalReps: z.number(),
  totalSets: z.number(),
  completedSets: z.number(),
  totalVolumeKg: z.number(),
  durationMinutes: z.number(),
});

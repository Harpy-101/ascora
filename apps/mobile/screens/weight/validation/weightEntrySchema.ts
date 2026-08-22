import { z } from "zod";

export const weightEntrySchema = z.object({
  weightInKg: z.coerce
    .number<string>({ error: "Must be a valid number" })
    .positive("Must be a positive number")
    .max(500, "Weight cannot exceed 500kg"),
  recordedAt: z.string().optional(),
});

export type WeightEntryInput = z.input<typeof weightEntrySchema>;
export type WeightEntryValues = z.infer<typeof weightEntrySchema>;

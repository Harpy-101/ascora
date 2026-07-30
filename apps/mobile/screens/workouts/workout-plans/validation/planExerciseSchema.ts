import { z } from "zod";

// const planSetSchema = z.object({
//   id: z.string(),
// });

const planExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string().min(1),
  name: z.string(),

  setNumber: z.number().int(),
  setCount: z.number().int().min(1),
  targetReps: z.number().int().nullable(),
  targetWeight: z.number().nullable(),
});

export const workoutPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter a plan name")
    .max(80, "Plan name is too long"),
  description: z.string().trim().max(240, "Description is too long").nullable(),
  exercises: z.array(planExerciseSchema).min(1, "Add at least one exercise"),
});

export type WorkoutPlanFormValues = z.infer<typeof workoutPlanSchema>;

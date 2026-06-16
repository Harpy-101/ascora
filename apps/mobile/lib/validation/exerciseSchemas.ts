import { z } from "zod";

const SetSchema = z.object({
  id: z.string(),
  setNumber: z.number(),
  weight: z.string().min(1, { error: "must be more than 1" }),
  reps: z.string().min(1, { error: "must be more than 1 rep" }),
  completed: z.boolean(),
});

const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  sets: z.array(SetSchema).min(1),
});

export const WorkoutFormSchema = z.object({
  name: z.string().min(1),
  notes: z.string().optional(),
  exercises: z.array(ExerciseSchema),
});

export const CompletedSetSchema = SetSchema.superRefine((set, ctx) => {
  if (!set.completed) return;

  if (set.weight.trim() === "") {
    ctx.addIssue({
      code: "custom",
      path: ["weight"],
      message: "Weight is required",
    });
  }

  if (set.weight.trim() === "") {
    ctx.addIssue({
      code: "custom",
      path: ["reps"],
      message: "Reps are required",
    });
  }

  const weight = Number(set.weight);
  const reps = Number(set.reps);

  if (Number.isNaN(weight) || weight < 0) {
    ctx.addIssue({
      code: "custom",
      path: ["weight"],
      message: "Enter a valid weight",
    });
  }

  if (!Number.isInteger(reps) || reps <= 0) {
    ctx.addIssue({
      code: "custom",
      path: ["reps"],
      message: "Enter valid reps",
    });
  }
});

export type WorkoutFormValues = z.infer<typeof WorkoutFormSchema>;

// import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import saveActiveWorkout from "./saveActiveWorkout";
import { WorkoutSaveValues } from "../types";

type CompleteWorkoutValues = {
  workoutId: string;
  values: WorkoutSaveValues;
};

export default async function completeWorkout({
  workoutId,
  values,
}: CompleteWorkoutValues) {
  await saveActiveWorkout({ workoutId, values, intent: "complete" });
}

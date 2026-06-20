import insertWorkout from "@/db/workouts/insertWorkout";
import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import { useMutation } from "@tanstack/react-query";

export default function useInsertWorkout() {
  return useMutation({
    mutationFn: async (values: WorkoutFormValues) => insertWorkout(values),
    onError: (error) => {
      console.error("Error while trying to insert workout", error.message);
    },
    onSuccess: () => {
      console.log("Inserted workout succsefully");
    },
  });
}

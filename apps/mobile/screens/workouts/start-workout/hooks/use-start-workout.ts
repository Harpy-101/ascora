import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import startEmptyWorkout from "../db/startEmptyWorkout";
import startWorkoutFromTemplate from "../db/startWorkoutFromTemplate";

type StartWorkoutVariables = {
  templateId: string | null;
};

export default function useStartWorkout() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateId }: StartWorkoutVariables) => {
      if (!user?.id) {
        throw new Error("User must be logged in");
      }
      console.log("Started workout");
      if (templateId !== null) {
        return startWorkoutFromTemplate(user.id, templateId);
      } else {
        return startEmptyWorkout(user.id);
      }
    },

    onSuccess: async () => {
      if (!user?.id) return;

      await queryClient.invalidateQueries({ queryKey: ["active-workout"] });
    },
  });
}

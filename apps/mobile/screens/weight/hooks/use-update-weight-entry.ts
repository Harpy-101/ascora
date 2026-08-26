import { useMutation } from "@tanstack/react-query";
import updateWeightEntry from "../db/updateWeightEntry";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { WeightEntryValues } from "../validation/weightEntrySchema";
import { queryClient } from "@/lib/query-client/queryClient";
import { useRouter } from "expo-router";

export default function useUpdateWeightEntry() {
  const router = useRouter();
  const { user } = useCurrentUser();

  if (!user?.id) {
    throw new Error("User must be logged in");
  }

  return useMutation({
    mutationFn: async ({
      weightEntryId,
      values,
    }: {
      weightEntryId: string;
      values: WeightEntryValues;
    }) => updateWeightEntry(user.id, weightEntryId, values),

    onError: (error) => {
      console.log(`Failed to update weight entry: ${error.message}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weight-history", user.id] });
      queryClient.invalidateQueries({ queryKey: ["user-goals", user?.id] });
      router.back();
    },
  });
}

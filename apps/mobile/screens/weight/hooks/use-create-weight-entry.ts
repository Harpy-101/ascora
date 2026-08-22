import { useMutation } from "@tanstack/react-query";
import createWeightEntry from "../db/createWeightEntry";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { WeightEntryValues } from "../validation/weightEntrySchema";
import { queryClient } from "@/lib/query-client/queryClient";
import { useRouter } from "expo-router";

export default function useCreateWeightEntry() {
  const { user } = useCurrentUser();
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: WeightEntryValues) => {
      if (!user?.id) {
        throw new Error(`User must be logged in`);
      }

      return createWeightEntry({ userId: user.id, values });
    },
    onError: (error) => {
      console.error("falied to create workout paln", error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weight-history", user?.id] });
      router.back();
    },
  });
}

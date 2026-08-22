import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { useQuery } from "@tanstack/react-query";
import { getWeightEntryById } from "../db/getWeightEntryById";

export default function useGetWeightEntryById(weightEntryId: string) {
  const { user } = useCurrentUser();

  if (!user?.id) {
    throw new Error("User must be logged in");
  }

  return useQuery({
    queryKey: ["weight-entry", weightEntryId, user.id],
    queryFn: async () => getWeightEntryById(user.id, weightEntryId),
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!user.id && !!weightEntryId,
  });
}

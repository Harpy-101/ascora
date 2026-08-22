import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { useQuery } from "@tanstack/react-query";
import getWeightHistory from "../db/getWeightHistory";

export default function useWeightHistory() {
  const { user } = useCurrentUser();
  if (!user?.id) {
    throw new Error("User must be logged in");
  }

  return useQuery({
    queryKey: ["weight-history", user.id],
    queryFn: async () => getWeightHistory({ userId: user.id }),
    enabled: !!user.id,
  });
}

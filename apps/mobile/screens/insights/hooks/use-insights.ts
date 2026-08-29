import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { useQuery } from "@tanstack/react-query";
import getInsights from "../db/getInsights";

export default function useInsights() {
  const { user } = useCurrentUser();

  if (!user?.id) {
    throw new Error("User must be logged in");
  }

  return useQuery({
    queryKey: ["user-insights", user?.id],
    queryFn: async () => getInsights(user.id),
    enabled: !!user.id,
  });
}

import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { useQuery } from "@tanstack/react-query";
import getLatestWeightEntry from "../db/getLatestWeightEntry";

export default function useGetLastWeight() {
  const { user } = useCurrentUser();

  if (!user?.id) {
    throw new Error("User must be logged in");
  }

  return useQuery({
    queryKey: ["last-weight-entry", user?.id],
    queryFn: async () => getLatestWeightEntry({ userId: user.id }),
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!user.id,
  });
}

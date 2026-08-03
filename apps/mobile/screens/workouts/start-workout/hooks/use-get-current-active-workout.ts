import { useQuery } from "@tanstack/react-query";
import getCurrentActiveWorkout from "../db/getCurrentActiveWorkout";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";

export default function useGetCurrentActiveWorkout() {
  const { user } = useCurrentUser();
  return useQuery({
    queryKey: ["active-workout"],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User must be logged in");
      }
      return getCurrentActiveWorkout(user.id);
    },
    enabled: !!user?.id,
  });
}

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { requestSync as requestCoordinatedSync } from "../coordinator/syncCoordinator";

export default function useSync() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const sync = useCallback(async () => {
    if (!user?.id) {
      throw new Error("User must be logged in in order to sync");
    }

    const result = await requestCoordinatedSync(user.id);

    if (result.insightChanged) {
      await queryClient.invalidateQueries({
        queryKey: ["user-insights", user.id],
      });
    }

    return result;
  }, [user?.id, queryClient]);

  return {
    sync,
  };
}

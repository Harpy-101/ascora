import { useCallback, useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import useSync from "./useSync";

const DEFAULT_SYNC_INTERVAL = 2 * 60 * 1000;

type UseSyncLifecycleOptions = {
  intervalMs?: number;
};

export default function useSyncLifecycle({
  intervalMs = DEFAULT_SYNC_INTERVAL,
}: UseSyncLifecycleOptions = {}) {
  const { sync } = useSync();

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const onlineRef = useRef<boolean | null>(null);

  const triggerSync = useCallback(() => {
    if (AppState.currentState !== "active" || onlineRef.current !== true) {
      return;
    }

    void sync().catch((error) => {
      console.error("Lifecycle sync failed:", error);
    });
  }, [sync]);

  useEffect(() => {
    /*
     * 1. Watch app foreground/background state.
     */
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextState) => {
        const previousState = appStateRef.current;

        appStateRef.current = nextState;

        const becameActive =
          previousState !== "active" && nextState === "active";

        if (becameActive) {
          triggerSync();
        }
      },
    );

    /*
     * 2. Watch connectivity.
     */
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const wasOnline = onlineRef.current;

      const isOnline =
        state.isConnected === true && state.isInternetReachable !== false;

      onlineRef.current = isOnline;

      /*
       * Also handles initial subscription:
       *
       * null -> true
       *
       * as well as:
       *
       * false -> true
       */
      if (isOnline && wasOnline !== true) {
        triggerSync();
      }
    });

    /*
     * 3. Periodic foreground sync.
     */
    const interval = setInterval(() => {
      triggerSync();
    }, intervalMs);

    return () => {
      appStateSubscription.remove();
      unsubscribeNetInfo();
      clearInterval(interval);
    };
  }, [intervalMs, triggerSync]);
}

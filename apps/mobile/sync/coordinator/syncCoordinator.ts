import runSync from "../engine/runSync";

type SyncResult = {
  insightChanged: boolean;
};

type CoordinatorState = {
  running: Promise<SyncResult> | null;
  requestedAgain: boolean;
};

const states = new Map<string, CoordinatorState>();

export function requestSync(userId: string): Promise<SyncResult> {
  let state = states.get(userId);

  if (!state) {
    state = {
      running: null,
      requestedAgain: false,
    };

    states.set(userId, state);
  }

  if (state.running) {
    state.requestedAgain = true;

    return state.running;
  }

  const currentState = state;

  currentState.running = (async () => {
    let insightChanged = false;

    try {
      do {
        currentState.requestedAgain = false;

        const result = await runSync(userId);

        if (result.insightChanged) {
          insightChanged = true;
        }
      } while (currentState.requestedAgain);

      return {
        insightChanged,
      };
    } finally {
      currentState.running = null;

      if (!currentState.requestedAgain) {
        states.delete(userId);
      }
    }
  })();

  return currentState.running;
}

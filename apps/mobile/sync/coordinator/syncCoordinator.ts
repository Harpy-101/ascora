import runSync from "../engine/runSync";

type CoordinatorState = {
  running: Promise<void> | null;
  requestedAgain: boolean;
};

const states = new Map<string, CoordinatorState>();

export function requestSync(userId: string): Promise<void> {
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
    try {
      do {
        currentState.requestedAgain = false;

        await runSync(userId);
      } while (currentState.requestedAgain);
    } finally {
      currentState.running = null;

      if (!currentState.requestedAgain) {
        states.delete(userId);
      }
    }
  })();

  return currentState.running;
}

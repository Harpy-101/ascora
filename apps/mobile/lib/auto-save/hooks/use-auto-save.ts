import { useCallback, useEffect, useRef, useState } from "react";
import {
  FieldValues,
  UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";
import { AppState } from "react-native";

type UseAutoSaveOptions<TValues extends FieldValues> = {
  form: UseFormReturn<TValues>;
  save: (values: TValues) => Promise<void>;
  delay?: number;
  enabled?: boolean;
};

export type AutoSaveStatus =
  | "idle"
  | "unsaved"
  | "saving"
  | "saved"
  | "error"
  | "paused";

type SaveRequest<TValues> = {
  revision: number;
  values: TValues;
  fingerPrint: string;
};

function getFingerPrint<T>(value: T): string {
  return JSON.stringify(value);
}

function cloneJsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export default function useAutoSave<TValues extends FieldValues>({
  form,
  save,
  delay = 750,
  enabled = true,
}: UseAutoSaveOptions<TValues>) {
  const watchedValues = useWatch({
    control: form.control,
  });

  const { isDirty } = useFormState({
    control: form.control,
  });

  const [status, setStatus] = useState<AutoSaveStatus>("idle");

  const [error, setError] = useState<Error | null>(null);

  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pendingRef = useRef<SaveRequest<TValues> | null>(null);

  const drainPromiseRef = useRef<Promise<void> | null>(null);

  const revisionRef = useRef(0);

  const lastSavedFingerprintRef = useRef(getFingerPrint(form.getValues()));

  const enabledRef = useRef(enabled);

  // useEffect(() => {
  //   enabledRef.current = enabled;

  //   if (!enabled) {
  //     setStatus("paused");
  //   } else if (status === "paused") {
  //     setStatus("idle");
  //   }
  // }, [enabled, status]);

  useEffect(() => {
    enabledRef.current = enabled;

    if (!enabled) {
      setStatus("paused");
    } else {
      setStatus((currentStatus) =>
        currentStatus === "paused" ? "idle" : currentStatus,
      );
    }
  }, [enabled]);

  const clearDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const enqueue = useCallback((values: TValues) => {
    if (!enabledRef.current) {
      return;
    }

    const snapshot = cloneJsonValue(values);
    const fingerPrint = getFingerPrint(snapshot);

    if (fingerPrint === lastSavedFingerprintRef.current) {
      return;
    }

    if (fingerPrint === pendingRef.current?.fingerPrint) {
      return;
    }

    revisionRef.current += 1;

    pendingRef.current = {
      revision: revisionRef.current,
      values: snapshot,
      fingerPrint: fingerPrint,
    };

    setError(null);
    setStatus("unsaved");
  }, []);

  const drain = useCallback((): Promise<void> => {
    /*
     * A save is already running. Return the same promise.
     *
     * Any new snapshot is written into pendingRef and will be
     * picked up by the running while loop.
     */
    if (drainPromiseRef.current) {
      return drainPromiseRef.current;
    }

    const drainPromise = (async () => {
      while (pendingRef.current) {
        const request = pendingRef.current;

        /*
         * Remove it before awaiting. If the form changes while
         * saving, enqueue() writes the newer snapshot here.
         */
        pendingRef.current = null;

        if (request.fingerPrint === lastSavedFingerprintRef.current) {
          continue;
        }

        setStatus("saving");
        setError(null);

        try {
          await save(request.values);

          lastSavedFingerprintRef.current = request.fingerPrint;

          setLastSavedAt(new Date());

          /*
           * There may already be a newer snapshot pending.
           */
          setStatus(pendingRef.current ? "unsaved" : "saved");
        } catch (unknownError) {
          const normalizedError =
            unknownError instanceof Error
              ? unknownError
              : new Error("The workout could not be saved.");

          /*
           * If a newer snapshot exists, keep the newer one.
           * Otherwise, restore the failed snapshot so Retry
           * attempts it again.
           */
          if (!pendingRef.current) {
            pendingRef.current = request;
          }

          setError(normalizedError);
          setStatus("error");

          throw normalizedError;
        }
      }
    })().finally(() => {
      drainPromiseRef.current = null;
    });

    drainPromiseRef.current = drainPromise;

    return drainPromise;
  }, [save]);

  const schedule = useCallback(
    (values: TValues) => {
      enqueue(values);
      clearDebounce();

      timeoutRef.current = setTimeout(() => {
        void drain().catch(() => {});
      }, delay);
    },
    [clearDebounce, delay, drain, enqueue],
  );

  const fluse = useCallback(
    async (values?: TValues) => {
      clearDebounce();
      enqueue(values ?? form.getValues());

      await drain();
    },
    [clearDebounce, drain, enqueue, form],
  );

  const retry = useCallback(async () => {
    clearDebounce();
    await drain();
  }, [clearDebounce, drain]);

  const pause = useCallback(() => {
    enabledRef.current = false;
    clearDebounce();
    setStatus("paused");
  }, [clearDebounce]);

  const resume = useCallback(() => {
    enabledRef.current = true;
    if (pendingRef.current) {
      setStatus("unsaved");
    } else {
      setStatus("idle");
    }
  }, []);

  const settleForFinalSave = useCallback(async () => {
    clearDebounce();
    pendingRef.current = null;
    const runningSave = drainPromiseRef.current;

    if (runningSave) {
      await runningSave;
    }
  }, [clearDebounce]);

  useEffect(() => {
    if (!enabled || !isDirty) {
      return;
    }

    schedule(form.getValues());
  }, [enabled, form, isDirty, schedule, watchedValues]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        void fluse().catch(() => {});
      }
    });

    return () => {
      subscription.remove();
    };
  }, [fluse]);

  useEffect(() => {
    return () => {
      clearDebounce();
    };
  }, [clearDebounce]);

  return {
    status,
    error,
    lastSavedAt,
    hasPendingChanges:
      status === "unsaved" || status === "saving" || status === "error",
    fluse,
    retry,
    pause,
    resume,
    settleForFinalSave,
  };
}

export type ExerciseHistoryMetrics = {
  totalSessions: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  bestWeight: number | null;
  bestEstimatedOneRepMax: number | null;
  bestSetVolume: number | null;
  bestSessionVolume: number | null;
  lastPerformedAt: string | null;
};

export type ExerciseHistory = {
  exerciseId: string;

  metrics: ExerciseHistoryMetrics;

  progression: {
    date: string;
    workoutId: string;
    maxWeight: number | null;
    estimatedOneRepMax: number | null;
    sessionVolume: number;
    totalReps: number;
  }[];

  recentSessions: {
    workoutId: string;
    date: string;
    sessionVolume: number;
    maxWeight: number | null;
    estimatedOneRepMax: number | null;
    sets: {
      setIndex: number;
      weight: number | null;
      reps: number | null;
      volume: number;
    }[];
  }[];
};

export type ProgressionPoint = {
  date: string;
  workoutId: string;
  maxWeight: number | null;
  estimatedOneRepMax: number | null;
  sessionVolume: number;
  totalReps: number;
};

export const HISTORY_RANGE_OPTIONS = [
  { label: "1M", value: "1M" },
  { label: "3M", value: "3M" },
  { label: "6M", value: "6M" },
  { label: "1Y", value: "12M" },
  { label: "All", value: "ALL" },
] as const;

export type HistoryRange = (typeof HISTORY_RANGE_OPTIONS)[number]["value"];

export type ChartMetric = "estimatedOneRepMax" | "maxWeight" | "sessionVolume";

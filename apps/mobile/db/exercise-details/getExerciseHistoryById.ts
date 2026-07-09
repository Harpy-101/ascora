import { ExerciseHistory } from "@/screens/exercise-details/types";
import getExerciseHistoryRows from "./getExertciseHistoryRows";

export default async function getExerciseHistory(
  exerciseId: string,
): Promise<ExerciseHistory> {
  const rows = await getExerciseHistoryRows(exerciseId);

  const sessionsByWorkoutId = new Map<
    string,
    ExerciseHistory["recentSessions"][number]
  >();

  for (const row of rows) {
    const volume = calculateSetVolume(row.weight, row.reps);
    const estimatedOneRepMax = estimateOneRepMax(row.weight, row.reps);

    const existing = sessionsByWorkoutId.get(row.workoutId);

    if (!existing) {
      sessionsByWorkoutId.set(row.workoutId, {
        workoutId: row.workoutId,
        date: row.workoutStartedAt,
        sessionVolume: volume,
        maxWeight: row.weight,
        estimatedOneRepMax,
        sets: [
          {
            setIndex: row.setIndex,
            weight: row.weight,
            reps: row.reps,
            volume,
          },
        ],
      });

      continue;
    }

    existing.sessionVolume += volume;

    if (
      row.weight != null &&
      (existing.maxWeight == null || row.weight > existing.maxWeight)
    ) {
      existing.maxWeight = row.weight;
    }

    if (
      estimatedOneRepMax != null &&
      (existing.estimatedOneRepMax == null ||
        estimatedOneRepMax > existing.estimatedOneRepMax)
    ) {
      existing.estimatedOneRepMax = estimatedOneRepMax;
    }

    existing.sets.push({
      setIndex: row.setIndex,
      weight: row.weight,
      reps: row.reps,
      volume,
    });
  }

  const sessionsAsc = Array.from(sessionsByWorkoutId.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const progression = sessionsAsc.map((session) => ({
    date: session.date,
    workoutId: session.workoutId,
    maxWeight: session.maxWeight,
    estimatedOneRepMax:
      session.estimatedOneRepMax == null
        ? null
        : Math.round(session.estimatedOneRepMax * 10) / 10,
    sessionVolume: session.sessionVolume,
    totalReps: session.sets.reduce((sum, set) => sum + (set.reps ?? 0), 0),
  }));

  const allSets = sessionsAsc.flatMap((session) => session.sets);

  const totalSessions = sessionsAsc.length;
  const totalSets = allSets.length;
  const totalReps = allSets.reduce((sum, set) => sum + (set.reps ?? 0), 0);
  const totalVolume = allSets.reduce((sum, set) => sum + set.volume, 0);

  const bestWeight = maxNullable(allSets.map((set) => set.weight));

  const bestEstimatedOneRepMax = maxNullable(
    allSets.map((set) => estimateOneRepMax(set.weight, set.reps)),
  );

  const bestSetVolume = maxNullable(allSets.map((set) => set.volume));

  const bestSessionVolume = maxNullable(
    sessionsAsc.map((session) => session.sessionVolume),
  );

  const lastPerformedAt =
    sessionsAsc.length > 0 ? sessionsAsc[sessionsAsc.length - 1].date : null;

  return {
    exerciseId,
    metrics: {
      totalSessions,
      totalSets,
      totalReps,
      totalVolume,
      bestWeight,
      bestEstimatedOneRepMax:
        bestEstimatedOneRepMax == null
          ? null
          : Math.round(bestEstimatedOneRepMax * 10) / 10,
      bestSetVolume,
      bestSessionVolume,
      lastPerformedAt,
    },
    progression,
    recentSessions: sessionsAsc.slice().reverse().slice(0, 10),
  };
}

function maxNullable(values: Array<number | null>) {
  const validValues = values.filter(
    (value): value is number => value != null && Number.isFinite(value),
  );

  if (validValues.length === 0) return null;

  return Math.max(...validValues);
}

function calculateSetVolume(weight: number | null, reps: number | null) {
  if (weight == null || reps == null) return 0;
  return weight * reps;
}

function estimateOneRepMax(weight: number | null, reps: number | null) {
  if (weight == null || reps == null || reps <= 0) return null;

  // Epley formula
  return weight * (1 + reps / 30);
}

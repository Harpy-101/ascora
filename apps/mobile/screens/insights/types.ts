export type WorkoutSummaryInsightData = {
  totalReps: number;
  totalSets: number;
  completedSets: number;
  totalVolumeKg: number;
  durationMinutes: number;
};

export type Insight = {
  id: string;
  insightType: string;
  title: string;
  message: string;
  createdAt: string;
  data: unknown;
};

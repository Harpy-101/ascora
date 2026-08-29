const INSIGHT_TYPE_LABELS: Record<string, string> = {
  workout_summary: "Workout summary",
  progress: "Progress",
  personal_record: "Personal record",
  consistency: "Consistency",
  volume_change: "Volume change",
  exercise_progress: "Exercise progress",
};

export default function formatInsightType(type: string): string {
  const knownLabel = INSIGHT_TYPE_LABELS[type];

  if (knownLabel) {
    return knownLabel;
  }

  const formatted = type.replace(/_/g, " ").trim();

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

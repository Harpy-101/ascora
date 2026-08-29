import { Insight } from "../types";
import { workoutSummaryInsightDataSchema } from "../validation/workoutSummaryInsightDataSchema ";

export function parseInsightData(insight: Insight) {
  switch (insight.insightType) {
    case "workout_summary": {
      const result = workoutSummaryInsightDataSchema.safeParse(insight.data);

      return result.success ? result.data : null;
    }

    default:
      return null;
  }
}

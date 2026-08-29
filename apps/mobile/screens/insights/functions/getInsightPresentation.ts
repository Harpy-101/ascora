import {
  Dumbbell,
  Flame,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react-native";

export function getInsightPresentation(type: string) {
  switch (type) {
    case "workout_summary":
      return {
        icon: Dumbbell,
        label: "Workout summary",
      };

    case "progress":
      return {
        icon: TrendingUp,
        label: "Progress",
      };

    case "personal_record":
      return {
        icon: Trophy,
        label: "Personal record",
      };

    case "consistency":
      return {
        icon: Flame,
        label: "Consistency",
      };

    default:
      return {
        icon: Sparkles,
        label: "Insight",
      };
  }
}

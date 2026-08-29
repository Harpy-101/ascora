import ThemedIcon from "@/components/ui/themed-icon";
import {
  Dumbbell,
  Flame,
  Sparkles,
  Trophy,
  TrendingUp,
  ChartNoAxesCombined,
  type LucideIcon,
} from "lucide-react-native";
import { View } from "react-native";

type InsightIconProps = {
  type: string;
  size?: number;
};

function getInsightIcon(type: string): LucideIcon {
  switch (type) {
    case "workout_summary":
      return Dumbbell;

    case "progress":
    case "exercise_progress":
      return TrendingUp;

    case "personal_record":
      return Trophy;

    case "consistency":
      return Flame;

    case "volume_change":
      return ChartNoAxesCombined;

    default:
      return Sparkles;
  }
}

export default function InsightIcon({ type, size = 20 }: InsightIconProps) {
  const icon = getInsightIcon(type);

  return (
    <View className="size-10 items-center justify-center rounded-full bg-primary/10">
      <ThemedIcon icon={icon} size={size} colorToken="primary" />
    </View>
  );
}

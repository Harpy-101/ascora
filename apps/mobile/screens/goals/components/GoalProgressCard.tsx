import { View } from "react-native";
import { Text } from "@/components/ui/text";
import GoalProgressBar from "./GoalProgressBar";

type GoalProgressCardProps = {
  title: string;
  progress: number;
  expectedProgress: number;
};

export function GoalProgressCard({
  title,
  progress,
  expectedProgress,
}: GoalProgressCardProps) {
  const difference = progress - expectedProgress;

  const pace =
    Math.abs(difference) < 3 ? "on-track" : difference > 0 ? "ahead" : "behind";

  const tone =
    pace === "ahead" ? "positive" : pace === "behind" ? "negative" : "neutral";

  return (
    <View className="gap-6 rounded-2xl border border-border bg-card p-5">
      <Text variant="h3">{title}</Text>

      <GoalProgressBar
        progress={progress}
        expectedProgress={expectedProgress}
        tone={tone}
      />

      <View className="gap-1">
        <Text>
          {pace === "ahead" && (
            <>
              You&apos;re{" "}
              <Text className="font-semibold text-emerald-600">
                ahead of pace
              </Text>
            </>
          )}

          {pace === "behind" && (
            <>
              You&apos;re{" "}
              <Text className="font-semibold text-red-500">behind pace</Text>
            </>
          )}

          {pace === "on-track" && "You're on track"}
        </Text>

        <Text className="text-sm text-muted-foreground">
          {Math.round(progress)}% complete
          {" · "}
          {Math.round(expectedProgress)}% expected by today
        </Text>
      </View>
    </View>
  );
}

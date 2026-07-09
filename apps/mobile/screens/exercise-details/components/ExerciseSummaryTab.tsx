import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { buildMuscleActivationMap } from "@/components/muscle-map/buildMuscleActivationMap";
import { capitalize } from "@/lib/utils";
import MuscleMapViewer from "./tabs/summary/MuscleMapViewer";

type ExerciseSummaryTabProps = {
  equipments: string[];
  bodyParts: string[];
  exerciseType: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  overview: string;
};

export default function ExerciseSummaryTab({
  equipments,
  bodyParts,
  exerciseType,
  targetMuscles,
  secondaryMuscles,
  overview,
}: ExerciseSummaryTabProps) {
  const activityMap = buildMuscleActivationMap({
    primaryMuscles: targetMuscles,
    secondaryMuscles: secondaryMuscles,
  });
  return (
    <View>
      <Text variant="h3">Overview</Text>
      <Text variant="p">{overview}</Text>
      <View className="gap-4 mt-4 rounded-2xl border border-border bg-card p-4">
        <View className="flex-row items-center justify-between">
          <Text variant="h3">Muscles Worked</Text>

          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-1">
              <View className="h-2.5 w-2.5 rounded-full bg-[#059669]" />
              <Text className="text-xs text-muted-foreground">Primary</Text>
            </View>

            <View className="flex-row items-center gap-1">
              <View className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
              <Text className="text-xs text-muted-foreground">Secondary</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-4 items-center">
          <View className="flex-1 gap-4">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-[#059669]">
                Primary
              </Text>

              {targetMuscles.map((muscle) => (
                <View
                  key={muscle}
                  className="rounded-full bg-[#059669]/10 px-3 py-1.5"
                >
                  <Text className="text-sm text-foreground">
                    {capitalize(muscle)}
                  </Text>
                </View>
              ))}
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-[#F59E0B]">
                Secondary
              </Text>

              {secondaryMuscles.slice(0, 4).map((muscle) => (
                <View
                  key={muscle}
                  className="rounded-full bg-[#F59E0B]/10 px-3 py-1.5"
                >
                  <Text className="text-sm text-foreground">
                    {capitalize(muscle)}
                  </Text>
                </View>
              ))}

              {secondaryMuscles.length > 4 ? (
                <Text className="text-xs text-muted-foreground">
                  +{secondaryMuscles.length - 4} more
                </Text>
              ) : null}
            </View>
          </View>

          <View className="w-[42%] h-65 justify-center rounded-xl">
            <MuscleMapViewer muscleMapData={activityMap} defaultSide="front" />
          </View>
        </View>
      </View>
    </View>
  );
}

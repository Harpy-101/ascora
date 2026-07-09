import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { ExerciseTips } from "./tabs/guide/ExerciseTips";

type ExerciseGuideTabProps = {
  instructions: string[];
  exerciseTips: string[];
};

export default function ExerciseGuideTab(exercise: ExerciseGuideTabProps) {
  return (
    <View className="flex w-full max-w-sm flex-col gap-6">
      <Text variant="h3">How to Perform</Text>
      <View className="gap-4">
        {exercise.instructions.map((item, idx) => (
          <View key={idx} className="w-full flex-row items-start gap-3">
            <View className="h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              <Text className="font-semibold text-primary">{idx + 1}</Text>
            </View>
            <Text variant="p" className="mt-0 flex-1 leading-6">
              {item}
            </Text>
          </View>
        ))}
      </View>

      <ExerciseTips tips={exercise.exerciseTips} />
    </View>
  );
}

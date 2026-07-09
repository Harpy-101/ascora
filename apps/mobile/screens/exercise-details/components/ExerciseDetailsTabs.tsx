import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { View } from "react-native";
import ExerciseSummaryTab from "./ExerciseSummaryTab";
import ExerciseGuideTab from "./ExerciseGuideTab";
import ExerciseHistoryTab from "./ExerciseHistoryTab";

type ExerciseDetailsProps = {
  equipments: string[];
  bodyParts: string[];
  exerciseType: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  overview: string;
  exerciseTips: string[];
  instructions: string[];
  exerciseId: string;
};

export default function ExerciseDetailsTabs(exercise: ExerciseDetailsProps) {
  const [value, setValue] = useState("summary");
  return (
    <View className="flex w-full max-w-sm flex-col gap-6">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTrigger value="summary">
            <Text>Summary</Text>
          </TabsTrigger>
          <TabsTrigger value="history">
            <Text>History</Text>
          </TabsTrigger>
          <TabsTrigger value="guide">
            <Text>Guide</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-2">
          <ExerciseSummaryTab
            bodyParts={exercise.bodyParts}
            equipments={exercise.equipments}
            exerciseType={exercise.exerciseType}
            overview={exercise.overview}
            secondaryMuscles={exercise.secondaryMuscles}
            targetMuscles={exercise.targetMuscles}
          />
        </TabsContent>
        <TabsContent value="guide" className="mt-2">
          <ExerciseGuideTab
            exerciseTips={exercise.exerciseTips}
            instructions={exercise.instructions}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-2">
          <ExerciseHistoryTab exerciseId={exercise.exerciseId} />
        </TabsContent>
      </Tabs>
    </View>
  );
}

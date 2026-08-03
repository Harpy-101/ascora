import { Button } from "@/components/ui/button";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import ExerciseAccordion from "./excersise-accordion/ExerciseAccordion";
import { useState } from "react";
import ExerciseListitem from "./ExerciseListItem";
import { Href, useRouter } from "expo-router";
import { useActiveWorkoutForm } from "@/contexts/active-workout-form-context";

type ExerciseListProps = {
  getExerciseLibraryUrl: () => Href;
};

export default function ExerciseList({
  getExerciseLibraryUrl,
}: ExerciseListProps) {
  const router = useRouter();
  const { removeExercise, exerciseFields } = useActiveWorkoutForm();

  const [deletingExerciseId, setDeletingExerciseId] = useState(() => new Set());

  function requestRemoveExercise(fieldId: string) {
    setDeletingExerciseId((current) => {
      const next = new Set(current);
      next.add(fieldId);
      return next;
    });
  }

  function commitRemoveExcerise(fieldId: string) {
    const index = exerciseFields.findIndex((field) => field.id === fieldId);

    if (index !== -1) {
      removeExercise(index);
    }

    setDeletingExerciseId((current) => {
      const next = new Set(current);
      next.delete(fieldId);
      return next;
    });
  }

  return (
    <>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold">Exercises</Text>

        <Button
          variant="outline"
          size="sm"
          onPress={() => router.push(getExerciseLibraryUrl())}
        >
          <Text>+ Exercise</Text>
        </Button>
      </View>

      {exerciseFields.map((exercise, index) => (
        <ExerciseListitem
          key={exercise.id}
          isDeleting={deletingExerciseId.has(exercise.id)}
          onExitComplete={() => commitRemoveExcerise(exercise.id)}
        >
          <ExerciseAccordion
            exerciseIndex={index}
            onRemoveExercise={() => requestRemoveExercise(exercise.id)}
          />
        </ExerciseListitem>
      ))}
    </>
  );
}

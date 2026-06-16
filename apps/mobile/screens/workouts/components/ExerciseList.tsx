import { Button } from "@/components/ui/button";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import ExerciseAccordion from "./excersise-accordion/ExerciseAccordion";
import { useFieldArray, useFormContext } from "react-hook-form";
import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";

import { useState } from "react";
import ExerciseListitem from "./ExerciseListItem";

export default function ExerciseList() {
  const { control } = useFormContext<WorkoutFormValues>();

  const [deletingExerciseId, setDeletingExerciseId] = useState(() => new Set());

  const {
    fields: exercisFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "exercises",
  });

  function addExercise() {
    append({
      id: `temp-exercise-${Date.now()}`,
      name: "New exercise",
      sets: [
        {
          id: `temp-set-${Date.now()}`,
          setNumber: 1,
          weight: "",
          reps: "",
          completed: false,
        },
      ],
    });
  }

  function requestRemoveExercise(fieldId: string) {
    setDeletingExerciseId((current) => {
      const next = new Set(current);
      next.add(fieldId);
      return next;
    });
  }

  function commitRemoveExcerise(fieldId: string) {
    const index = exercisFields.findIndex((field) => field.id === fieldId);

    if (index !== -1) {
      remove(index);
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

        <Button variant="outline" size="sm" onPress={addExercise}>
          <Text>+ Exercise</Text>
        </Button>
      </View>

      {exercisFields.map((exercise, index) => (
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

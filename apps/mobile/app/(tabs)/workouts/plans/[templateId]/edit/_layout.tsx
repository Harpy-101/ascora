import { WorkoutPlanFormProvider } from "@/contexts/workout-plan-form-context";
import useGetWorkoutPlanById from "@/screens/workouts/workout-plans/edit/hooks/use-get-workout-plan-by-id";
import { Stack, useLocalSearchParams } from "expo-router";

export default function EditWorkoutPlanLayout() {
  const params = useLocalSearchParams<{ templateId: string }>();
  const { data, isPending, error } = useGetWorkoutPlanById(params.templateId);

  if (error || isPending || !data) return null;

  const formData = {
    name: data.name,
    description: data.description,
    exercises: data.exercises.map((exer, idx) => {
      const firstSet = exer.sets[0];
      return {
        id: exer.id,
        exerciseId: exer.exerciseId,
        name: exer.name,

        setNumber: idx + 1,
        setCount: firstSet.setNumber,

        targetReps: firstSet?.targetReps ?? null,
        targetWeight: firstSet?.targetWeight ?? null,
      };
    }),
  };

  //   if (isPending) {
  //     return <WorkoutPlanEditLoadingState />;
  //   }

  //   if (isError || !formValues) {
  //     return <WorkoutPlanEditErrorState onRetry={refetch} />;
  //   }

  return (
    <WorkoutPlanFormProvider formValues={formData}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Edit workout plan",
          }}
        />

        <Stack.Screen
          name="exercises"
          options={{
            title: "Exercise library",
          }}
        />
      </Stack>
    </WorkoutPlanFormProvider>
  );
}

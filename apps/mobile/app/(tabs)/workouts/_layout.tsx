import { ActiveWorkoutFormProvider } from "@/contexts/active-workout-form-context";

import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <ActiveWorkoutFormProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="ExerciseLibrary"
          options={{ title: "Exercise Library" }}
        />
      </Stack>
    </ActiveWorkoutFormProvider>
  );
}

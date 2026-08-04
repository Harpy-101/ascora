import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="ExerciseLibrary"
        options={{ title: "Exercise Library" }}
      />
      <Stack.Screen
        name="[exerciseId]"
        options={{ title: "Exercise Details" }}
      />

      <Stack.Screen name="exercises" options={{ title: "Exercise screen 2" }} />
      <Stack.Screen
        name="exercises/[exerciseId]"
        options={{ title: "Exercise details 2" }}
      />
    </Stack>
  );
}

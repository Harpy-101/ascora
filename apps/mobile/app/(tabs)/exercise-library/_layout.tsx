import { Stack } from "expo-router";

export default function ExerciseLibraryLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[exerciseId]" options={{ headerShown: false }} />
    </Stack>
  );
}

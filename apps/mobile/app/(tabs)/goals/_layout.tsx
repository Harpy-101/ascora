import { Stack } from "expo-router";

export default function GoalsLeyout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="new/index" />
      <Stack.Screen name="edit/[goalId]" />
    </Stack>
  );
}

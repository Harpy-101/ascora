import { Stack } from "expo-router";

export default function UserWeightLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new/index" />
      <Stack.Screen name="edit/[weightEntryId]" />
    </Stack>
  );
}

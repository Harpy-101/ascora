import { Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="workouts" options={{ title: "Workouts" }} />
      {/* <Tabs.Screen name="settings" /> */}
    </Tabs>
  );
}

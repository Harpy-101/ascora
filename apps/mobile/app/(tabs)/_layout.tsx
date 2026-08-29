import ThemedIcon from "@/components/ui/themed-icon";
import useSyncLifecycle from "@/sync/lifecycle/use-sync-life-cycle";
import { Tabs } from "expo-router";
import {
  BookOpenText,
  Dumbbell,
  Goal,
  LayoutDashboard,
  Scale,
  Settings,
} from "lucide-react-native";

export default function AppLayout() {
  useSyncLifecycle();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: "Dashboard",
          tabBarIcon: () => <ThemedIcon icon={LayoutDashboard} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: () => <ThemedIcon icon={Dumbbell} />,
        }}
      />
      <Tabs.Screen
        name="exercise-library"
        options={{
          title: "Library",
          tabBarIcon: () => <ThemedIcon icon={BookOpenText} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: "Goals",
          tabBarIcon: () => <ThemedIcon icon={Goal} />,
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          title: "Weight",
          tabBarIcon: () => <ThemedIcon icon={Scale} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: () => <ThemedIcon icon={Settings} />,
        }}
      />
    </Tabs>
  );
}

import ThemedIcon from "@/components/ui/themed-icon";
import { Tabs } from "expo-router";
import { Dumbbell } from "lucide-react-native";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color }) => <ThemedIcon icon={Dumbbell} />,
        }}
      />
      {/* <Tabs.Screen name="settings" /> */}
    </Tabs>
    // <NativeTabs
    //   disableTransparentOnScrollEdge
    //   backgroundColor="#09090b"
    //   tintColor="#ffffff"
    //   iconColor={{
    //     default: "#a1a1aa",
    //     selected: "#ffffff",
    //   }}
    //   labelStyle={{
    //     color: "#a1a1aa",
    //   }}
    // >
    //   <NativeTabs.Trigger name="workouts">
    //     <Label>Workouts</Label>
    //     <Icon sf="dumbbell.fill" drawable="custom_android_drawable" />
    //   </NativeTabs.Trigger>
    // </NativeTabs>
  );
}

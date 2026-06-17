// import { Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";

import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 ">
      <Text className="text-2xl font-bold text-foreground">Ascora 🚀</Text>
      <Link href="/workouts" asChild>
        <Button>
          <Text>Enter the app</Text>
        </Button>
      </Link>
    </View>
  );
}

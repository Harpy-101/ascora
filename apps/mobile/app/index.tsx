// import { Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth/auth-client";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { requestSync } from "@/sync/coordinator/syncCoordinator";
import { Link } from "expo-router";

import { View } from "react-native";

export default function HomeScreen() {
  const { user } = useCurrentUser();

  if (!user?.id) {
    throw new Error("User needs to be logged in");
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 ">
      <Text className="text-2xl font-bold text-foreground">Ascora 🚀</Text>
      <Link href="/workouts" asChild>
        <Button>
          <Text>Enter the app</Text>
        </Button>
      </Link>
      <Link href="/signup" asChild>
        <Button>
          <Text>Enter auth</Text>
        </Button>
      </Link>
      <Button onPress={() => authClient.signOut()}>
        <Text>Signout</Text>
      </Button>
      <Link href="/workouts/plans" asChild>
        <Button>
          <Text>Workout plan</Text>
        </Button>
      </Link>
      <Link href="/workouts/start" asChild>
        <Button>
          <Text>WEokrout start screen</Text>
        </Button>
      </Link>
      <Button onPress={() => requestSync(user.id)}>
        <Text>request sync</Text>
      </Button>
    </View>
  );
}

import { ActivityIndicator, View } from "react-native";
import { useCurrentUser } from "./auth/context/current-user-context";
import { Text } from "@/components/ui/text";
import { Stack } from "expo-router";
import { Button } from "@/components/ui/button";

export default function RootNavigator() {
  const { status, error, retry } = useCurrentUser();

  if (status === "loading-session" || status === "initializing-user") {
    return <AppLoadingScreen />;
  }

  if (status === "error") {
    return <CurrentUserSetupErrorScreen error={error} onRetry={retry} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={status === "signed-out"}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={status === "ready"}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}

function AppLoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator />

      <Text className="mt-4 text-sm text-muted-foreground">
        Preparing Ascora...
      </Text>
    </View>
  );
}

type CurrentUserSetupErrorScreenProps = {
  error: Error | null;
  onRetry: () => void;
};

function CurrentUserSetupErrorScreen({
  error,
  onRetry,
}: CurrentUserSetupErrorScreenProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <Text className="text-xl font-semibold">
        We couldn&apos;t finish setting up your account
      </Text>

      <Text className="text-center text-sm leading-5 text-muted-foreground">
        Your account is signed in, but Ascora could not prepare its local data.
      </Text>

      {__DEV__ && error ? (
        <Text className="text-center text-xs text-destructive">
          {error.message}
        </Text>
      ) : null}

      <Button onPress={onRetry}>
        <Text>Try again</Text>
      </Button>
    </View>
  );
}

import { View } from "react-native";
import { CircleAlert, RefreshCw } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ThemedIcon from "../ui/themed-icon";

type ScreenErrorStateProps = {
  title?: string;
  message?: string;
  error?: unknown;
  retryLabel?: string;
  onRetry?: () => void;
};

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return null;
}

export default function ScreenErrorState({
  title = "Something went wrong",
  message,
  error,
  retryLabel = "Try again",
  onRetry,
}: ScreenErrorStateProps) {
  const displayedMessage =
    message ??
    getErrorMessage(error) ??
    "The requested information could not be loaded.";

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-background px-6">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <ThemedIcon icon={CircleAlert} size={27} colorToken="destructive" />
      </View>

      <View className="items-center gap-2">
        <Text className="text-center text-xl font-semibold">{title}</Text>

        <Text className="max-w-80 text-center text-sm leading-5 text-muted-foreground">
          {displayedMessage}
        </Text>
      </View>

      {onRetry ? (
        <Button variant="outline" onPress={onRetry}>
          <ThemedIcon icon={RefreshCw} size={17} colorToken="foreground" />

          <Text>{retryLabel}</Text>
        </Button>
      ) : null}
    </View>
  );
}

import { ActivityIndicator, View } from "react-native";

import { Text } from "@/components/ui/text";

type ScreenLoadingStateProps = {
  title?: string;
  message?: string;
};

export default function ScreenLoadingState({
  title = "Loading",
  message,
}: ScreenLoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <ActivityIndicator size="large" />

      <View className="items-center gap-1">
        <Text className="text-lg font-semibold">{title}</Text>

        {message ? (
          <Text className="max-w-72 text-center text-sm leading-5 text-muted-foreground">
            {message}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

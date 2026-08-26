import { ReactNode } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import ThemedIcon from "./themed-icon";
import { Button } from "./button";
import { Text } from "@/components/ui/text";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;

  showBack?: boolean;
  onBack?: () => void;

  rightAction?: ReactNode;
};

export default function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}: ScreenHeaderProps) {
  const router = useRouter();

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    }
  }

  return (
    <View className="w-full gap-2 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-start gap-3">
          {showBack && (
            <Button variant="ghost" size="icon" onPress={handleBack}>
              <ThemedIcon icon={ArrowLeft} size={22} colorToken="foreground" />
            </Button>
          )}

          <Text variant="h1" numberOfLines={1}>
            {title}
          </Text>
        </View>

        {rightAction ? <View className="ml-3">{rightAction}</View> : null}
      </View>

      {subtitle ? (
        <Text
          className={
            showBack
              ? "ml-12 text-sm text-muted-foreground"
              : "text-sm text-muted-foreground"
          }
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

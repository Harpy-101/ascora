import { View } from "react-native";
import ThemedIcon from "../ui/themed-icon";
import { Text } from "@/components/ui/text";
import { LucideIcon } from "lucide-react-native";
import { Button } from "../ui/button";

type ScreenEmptyStateProps = {
  mainIcon?: LucideIcon;
  mainText: string;
  description: string;
  actionText: string;
  actionIcon?: LucideIcon;
  actionFunction: () => void;
};

export default function ScreenEmptyState({
  mainIcon,
  mainText,
  actionFunction,
  actionText,
  description,
  actionIcon,
}: ScreenEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-5 px-6 py-16">
      {mainIcon ? (
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <ThemedIcon icon={mainIcon} size={29} colorToken="foreground" />
        </View>
      ) : null}

      <View className="items-center gap-2">
        <Text className="text-xl font-semibold">{mainText}</Text>

        <Text className="max-w-xs text-center text-sm leading-5 text-muted-foreground">
          {description}
        </Text>
      </View>

      <Button onPress={actionFunction}>
        {actionIcon ? (
          <ThemedIcon
            icon={actionIcon}
            size={18}
            colorToken="primaryForeground"
          />
        ) : null}
        <Text>{actionText}</Text>
      </Button>
    </View>
  );
}

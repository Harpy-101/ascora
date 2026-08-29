import { Text } from "@/components/ui/text";
import ThemedIcon from "@/components/ui/themed-icon";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

type SettingsRowProps = {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
};

export default function SettingfsRwo({
  title,
  destructive = false,
  icon,
  showChevron = true,
  subtitle,
  value,
  onPress,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-3 p-4"
    >
      {icon && (
        <View className="size-9 items-center justify-center rounded-lg bg-muted">
          <ThemedIcon
            icon={icon}
            size={18}
            colorToken={destructive ? "destructive" : "foreground"}
          />
        </View>
      )}

      <View className="flex-1">
        <Text className={destructive ? "text-destructive" : "text-foreground"}>
          {title}
        </Text>
      </View>

      {subtitle && (
        <Text className="text-sm text-muted-foreground">{subtitle}</Text>
      )}

      {value && <Text className="text-sm text-muted-foreground">{value}</Text>}

      {showChevron && onPress && (
        <ThemedIcon
          icon={ChevronRight}
          size={18}
          colorToken="mutedForeground"
        />
      )}
    </Pressable>
  );
}

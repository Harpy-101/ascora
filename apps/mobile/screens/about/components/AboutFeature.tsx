import ThemedIcon from "@/components/ui/themed-icon";
import { LucideIcon } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

type AboutFeatureProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function AboutFeature({
  icon,
  title,
  description,
}: AboutFeatureProps) {
  return (
    <View className="flex-row items-center gap-3 p-4">
      <View className="size-10 items-center justify-center rounded-lg bg-primary/10">
        <ThemedIcon icon={icon} size={20} colorToken="primary" />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="font-medium">{title}</Text>

        <Text className="text-sm text-muted-foreground">{description}</Text>
      </View>
    </View>
  );
}
